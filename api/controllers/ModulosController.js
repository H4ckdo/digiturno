/**
 * ModulosController.js
 *
 * @description :: This file describe the Modulos basics actions: show, showall and CRUD
 */

module.exports = {
  show: function(req, res) {
    const id = req.params.id;
    res.dispatchModel(Modulos.findOne({id}), resolveEndPoint(req));
  },
  showAll: function(req, res) {
    if(req.query.dispached === "true") {
      res.dispatchModel(Modulos.find().populate("tokens", { dispached: true }), resolveEndPoint(req));
    } else {
      res.dispatchModel(Modulos.find().populateAll(), resolveEndPoint(req));
    }
  },
  update: function(req, res) {
    const id = req.params.id;
    res.dispatchModel(Modulos.update({id}, req.body), resolveEndPoint(req));
  },
  remove: function(req , res) {
    const id = req.params.id;
    let responseCases = {
      success: { status: 202 }
    }
    res.dispatchModel(Modulos.destroy({id}), resolveEndPoint(req, responseCases));
  },
  create: function(req, res) {
    let responseCases = {
      success: {
        status: 201,
        beforeResponse: function(parsialData, next) {
          let data = parsialData.data;
          let toResponse = {
            data: {
              name: data.name,
              createdAt: data.createdAt,
              id: data.id,
              online: data.online,
              updatedAt: data.updatedAt,
              tokens: []
            }
          }
          sails.sockets.broadcast("TV", "newModulo", toResponse);
          next();
        }
      }
    }
    res.dispatchModel(Modulos.create(req.body), resolveEndPoint(req, responseCases));
  }
}

