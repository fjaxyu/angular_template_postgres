var jwt = require('jwt-simple');
var postgres = require('./pgDatabase.js');
var sql = require('./newdatabase.js');
var Promise = require('promise');
var User = sql.users;
var utils = require('./utils.js');


function login(req, res) {
    var user = req.body;
    var query = {};
    if (user.username !== undefined) {
        query.username = user.username;
    } else if (user.email !== undefined) {
        query.email = user.email;
    }
    if (user.password !== undefined) {
        query.password = user.password;
    } else if (user.facebook_id !== undefined) {
        query.facebook_id = user.facebook_id;
        query.facebook_token = user.facebook_token;
    } else {
        res.status(500).json('no password!');
        console.log('no password');
        return;
    }

    validate(query).done(function (d) {
        //GENERATE A TOKEN FOR THE USER
        var dbuser = genToken(d);
        res.body = dbuser;
        res.send(dbuser);

    }, function (err) {
        console.log(err);
        res.status(500).send({
            error: 'Something failed!'
        });
    });
}
exports.login = login;


function validate(query) {
    var authQuery = User.select(User.star()).where(User.email.equals(query.email)).toQuery();
    return new Promise(function (fulfill, reject) {
        postgres.query(authQuery, function (data, err) {
            if (data.rows.length === 0) {
                reject(err);    
            } else {
                var isValidPassword = utils.validatePassword(query.password, data.rows[0].password);
                if (isValidPassword === true) {
                    fulfill(data.rows[0]);   
                } else {
                    reject('invalid');
                }
            }
        });
    });
}
exports.validate = validate;


function getAll(req, res) {
    var query = User.select(User.star()).toQuery();
    postgres.query(query, function (data) {
        res.json(data.rows);
    });
}
exports.getAll = getAll;


function genToken(user) {
    var expires = expiresIn(180); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());
    user.token = token;
    user.expires = expires;
    return user;
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}
