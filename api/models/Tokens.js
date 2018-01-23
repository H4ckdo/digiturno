/**
 * Token.js
 *
 * @description :: Model that describe the Token entity
 */
const ObjectId = require('mongodb').ObjectID;
let counter = 1;

module.exports = {
  schema: true,
  attributes: {
    id: {
      type: 'objectid',
      primaryKey: true
    },
    name: {
      type: 'string'
    },
    moduloName: {
      type: 'string'
    },
    dispached: {
      type: 'boolean',
      defaultsTo: false
    },
    canceled: {
      type: 'boolean',
      defaultsTo: false
    },
    called: {
      type: 'boolean',
      defaultsTo: false
    },
    dispatchAt: {
      type: 'date'
    },
    canceledAt: {
      type: 'date'
    },
    dispatchedBy: {
      model: 'Modulos'
    }
  },
  types: {
    objectid: function(value) {
      let valid = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(value);
      if(valid) return new ObjectId(value);
      return false;
    }
  },
  beforeCreate: (data, next) => {
    data.name = counter;
    counter++;
    next();
  }
}
