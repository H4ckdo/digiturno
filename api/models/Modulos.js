/**
 * Modulo.js
 *
 * @description :: Model that describe the Modulo entity
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
    online: {
      type: 'boolean',
      defaultsTo: false
    },
    tokens: {
      collection: 'Tokens',
      via: 'dispatchedBy'
    },
    socketModulo: {
      type: 'string'
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
