var logger = require('tracer').colorConsole();
var jwt = require('jwt-simple');
var Bluebird = require('bluebird');
var utils = require('../lib/utils.js');
var db = require('../config/database');


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
        logger.log('no password');
        return;
    }

    validate(query).done(function (d) {
        //GENERATE A TOKEN FOR THE USER
        var dbuser = genToken(d);
        res.body = dbuser;
        res.send(dbuser);

    }, function (err) {
        logger.log(err);
        res.status(500).send({
            error: 'Something failed!'
        });
    });
}
exports.login = login;


function validate(query) {
    return new Bluebird(function (resolve, reject) {
        db.users.findOne({email: query.email}, function (err, data) {
//            logger.log(data);
            if (!data) {
                reject(err);
            } else {
                var isValidPassword = utils.validatePassword(query.password, data.password);
                if (isValidPassword === true) {
                    resolve(data);
                } else {
                    reject('invalid');
                }
            }
        });
    });
}
exports.validate = validate;


function getAll(req, res) {
    db.users.find({}, function(err, data){
        res.json(data);
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
