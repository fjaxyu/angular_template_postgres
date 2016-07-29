var constants = require('./constants');
var massive = require('massive');
var massiveInstance = massive.connectSync({connectionString : constants.connectionString});
module.exports = massiveInstance;