/**
 * TokensController.js
 *
 * @description :: This file describe the Tokens basics actions: show, showall and CRUD
 */

const room = "stack";

module.exports = {
  show: function(req, res) {
    const id = req.params.id;
    res.dispatchModel(Tokens.findOne({id}), resolveEndPoint(req));
  },//end show

  joinTV(req, res) {
    if(req.isSocket) {
      sails.sockets.join(req, "TV", (error) => {
        if(error) return res.serverError();
        res.dispatchModel(Tokens.find({called: true, dispached: false, canceled: false}));
      })
    } else {
      res.badRequest();
    }
  },//end joinTV

  joinToStack(req, res) {
    if(req.isSocket) {
      //let sessionAlready = req.session.moduloId
      //if(sessionAlready) console.log("YA TIENE UNA SESSION ABIERTA EN EL ROOM");
      sails.sockets.join(req, room, (error) => {
        if(error) return res.serverError();
        let socketModulo = sails.sockets.getId(req);
        Modulos.update({ id: req.query.moduloId }, { online: true, socketModulo }).then((docs) => {
          req.session.moduloId = req.query.moduloId;
          res.json({docs});
        })
        .catch((err) => res.serverError(err));
      })
    } else {
      res.badRequest();
    }
  },//end joinToStack

  showInTV(req, res) {
    let data = req.body;
    let id = data.id;
    let dispatchedBy = data.dispatchedBy;
    let responseCases = {
      success: {
        status: 200,
        beforeResponse: function(parsialData , next) {
          parsialData.data.state = "called";
          sails.sockets.broadcast("TV","newToken" ,parsialData);
          next();
        }
      }
    }
    res.dispatchModel(Tokens.update({ id }, { called: true }), resolveEndPoint(req, responseCases));
  },//end showInTV

  showAll: function(req, res) {
    res.dispatchModel(Tokens.find(), resolveEndPoint(req));
  },//ens showAll

  update: function(req, res) {
    const id = req.params.id;
    let responseCases = {
      success: {
        status: 200,
        beforeResponse: function(parsialData , next) {
          sails.sockets.broadcast("TV", "pullToken", parsialData);
          next();
        }
      }
    }
    res.dispatchModel(Tokens.update({ id }, req.body), resolveEndPoint(req, responseCases));
  },//end update

  remove: function(req , res) {
    const id = req.params.id;
    let responseCases = {
      success: { status: 202 }
    }
    res.dispatchModel(Tokens.destroy({id}), resolveEndPoint(req, responseCases));
  },//end remove

  create: function(req, res) {
    let responseCases = {
      success: {
        status: 201,
        beforeResponse: function(parsialData , next) {
          parsialData.data.state = "requested";
          let moduloChoosed = parsialData.data.dispatchedBy;
          let socketModulo = this.socketModulo;
          sails.sockets.emit(socketModulo, 'token:created', parsialData.data)
          next();
        }
      }
    }
    var socketId = sails.sockets.getId(req);
    debugger;
      Modulos.find({online: true})
        .populate('tokens')
        .then((docs) => {
          if(docs.length) {
            let inStack = docs.map((doc) => {
              doc.tokens = doc.tokens.filter((tok) => (tok.dispached === false && tok.canceled === false));
              return doc;
            })
            .sort((a, b) => (b.tokens.length < a.tokens.length))

            req.body.dispatchedBy = inStack[0].id;
            req.body.moduloName = inStack[0].name;

            responseCases.success.socketModulo = inStack[0].socketModulo;
            res.dispatchModel(Tokens.create(req.body), resolveEndPoint(req, responseCases));
          } else {
            //no modulos
            res.json({success: false, reason: 'any online', message: "No modulos "});
          }
        })
  }//end create
}

