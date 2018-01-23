/**
 * EPS.js
 *
 * @description :: Model that describe the EPS entity
 */
const ObjectId = require('mongodb').ObjectID;

module.exports = {
  schema: true,
  attributes: {
    id: {
      type: 'objectid',
      primaryKey: true
    },
    name: {
      type: 'string',
      unique: true
    },
    overloaded: {
      type: 'boolean',
      defaultsTo: false
    },
    contractValue: {
      type: 'integer'
    },
    alertValue: {
      type: 'integer'
    },
    availableMoney: {
      type: 'integer',
      defaultsTo: 0
    }
  },
  types: {
    objectid: function(value) {
      let valid = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(value);
      if(valid) return new ObjectId(value);
      return false;
    }
  }
}
