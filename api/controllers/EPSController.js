/**
 * EPSController.js
 *
 * @description :: This file describe the EPS basics actions: show, showall and CRUD
 */


module.exports = {
  show: function(req, res) {
    const id = req.params.id;
    res.dispatchModel(EPS.findOne({id}), resolveEndPoint(req));
  },
  showAll: function(req, res) {
    res.dispatchModel(EPS.find(), resolveEndPoint(req));
  },
  join: function (req, res) {
    if (req.isSocket) {
      sails.sockets.join(req, 'EPS', (error) => {
        if (error) return res.serverError();
        res.json({message: 'ok'});
      })
    } else {
      res.badRequest();
    }
  },
  update: function(req, res) {
    const id = req.params.id;
    let data = req.body;
    data.overloaded = Number(data.availableMoney) < Number(data.contractValue);
    console.log('data', data);
    res.dispatchModel(EPS.update({id}, req.body), resolveEndPoint(req));
  },
  remove: function(req , res) {
    const id = req.params.id;
    let responseCases = {
      success: { status: 202 }
    }
    res.dispatchModel(EPS.destroy({id}), resolveEndPoint(req, responseCases));
  },
  create: function(req, res) {
    let responseCases = {
      success: { status: 201 }
    }
    let data = req.body;
    data.availableMoney = data.contractValue;
    res.dispatchModel(EPS.create(req.body), resolveEndPoint(req, responseCases));
  }
}
