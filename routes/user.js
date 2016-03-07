var postgres = require('./pgDatabase.js')
var sql = require('./newdatabase.js')
var Customers = sql.customers
var pgUser = sql.users
var crypto = require('crypto');

var user = {
    get : function(req, res){
        var url = req.query.url;
        var query = "SELECT * FROM customers";
        postgres.query(query, function(data){
            console.log(data.rows);
            res.json(data.rows);
        })
    }
}

module.exports = user