var postgres = require('./pgDatabase.js');
var sql = require('./newdatabase.js');
var images = require('./images.js');
var auth = require('./auth.js');
var hash = require('sha1');
var Bluebird = require('bluebird');
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer, transporter;
var utils = require('./utils.js');
nodemailer = require('nodemailer');

//Only works when you do this --->https://accounts.google.com/b/0/DisplayUnlockCaptcha
//And you Enable less secure apps ---> https://support.google.com/accounts/answer/6010255?hl=en
transporter = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
        user: '', //your email here
        pass: '' //your password here
    }
}));


var User = sql.users;
var Image = sql.images;
var Gallery = sql.galleries;
var Product = sql.products;
var Feedback = sql.feedback;

//Checks the database to see if the user's email already exists
function userExists(email, fn) {
    return new Bluebird(function (resolve, reject) {
        var query = "SELECT COUNT(1) FROM users WHERE email='" + email + "'";
        postgres.query(query, function (data) {
            if (data.rows[0].count > 0) {
                reject(data.rows[0].count);
            } else {
                resolve(data.rows[0].count);
            }
        });
    });
}

//Checks the database to see if the user's email already exists
function checkForUsers(req, res) {
    console.log("GET - user.checkForUsers");
    var query = "select count(*)::integer from users where email = '" + req.params.email + "';";
    postgres.query(query, function (data) {
        if (data.rows[0].count === 0) {
            res.json('okay');
        } else {
            res.json('email exists');
        }
    });
}
exports.checkForUsers = checkForUsers;


function create(req, res) {
    console.log("POST - user.create");
    var email = req.body.email;
    var password = req.body.password;
    req.body.password = utils.encryptPassword(req.body.password);
    var query = User.insert(req.body).returning(User.user_id).toQuery();
    postgres.query(query, function (data) {
        res.json({
            message: 'created user'
        });
    });
}
exports.create = create;

function update(req, res) {
    console.log("UPDATE - user.update");
    var query = User.update(req.body).and(User.user_id.equals(req.body.user_id)).toQuery();
    console.log(query);
    postgres.query(query, function (data) {
        res.json(data.rows);
    });
}
exports.update = update;


function getUserByID(req, res) {
    console.log("GET - user.getUserByID");
    var obj = {};
    var id = req.params.id;
    var query = User.select(User.star()).where(User.user_id.equals(id)).toQuery();
    postgres.query(query, function (data) {
        res.json(data.rows);
    });
}
exports.getUserByID = getUserByID;


function getUser(user_id) {
    return new Bluebird(function (resolve, reject) {
        var query = User.select(User.star()).where(User.user_id.equals(user_id)).toQuery();
        postgres.query(query, function (data) {
            resolve(data.rows[0]);
        });
    });
}
exports.getUser = getUser;


function validateRecoverString(req, res) {
    var recoverString = req.params.recoverString;
    var user_id = req.params.user_id;
    var query = User.select(User.star()).where(User.user_id.equals(user_id)).and(User.recoverystring.equals(recoverString)).toQuery();
    postgres.query(query, function (data) {
        if (data.rows.length) {
            res.json({
                message: 'exists and is valid!'
            });
        } else {
            res.json({
                err: 'invalid send back to home screen'
            });
        }
    });

}
exports.validateRecoverString = validateRecoverString;


function recoverPassword(req, res) {
    validateEmail(req.params.email).then(function isValid(user) {
        var recover = makeRecoverString();
        var holdingUser = JSON.parse(JSON.stringify(user));
        user.recoverystring = recover;
        updateUser(user).then(function () {
                sendRecoveryEmail(holdingUser, req.params.email, recover).then(
                    function successOnEmail(messageBack) {
                        res.json(messageBack);
                    },
                    function errSendingEmail(error) {
                        res.json(error);
                    });
            },
            function errUpdating() {
                res.json({
                    err: 'Error updating user ' + user.user_id
                });
            });
    }, function emailNoExist() {
        res.json({
            err: 'email does not exist'
        });
    });
}
exports.recoverPassword = recoverPassword;


function updateUser(user) {
    console.log('Updating user: ' + user);
    var user_id = user.user_id;
    delete user.user_id;
    return new Bluebird(function (resolve, reject) {
        var query = User.update(user).where(User.user_id.equals(user_id)).returning(User.user_id).toQuery();
        postgres.query(query, function (data) {
            console.log(data);
            var action = data.rows.length ? resolve : reject;
            action(data);
        });
    });
}


function makeRecoverString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


function sendRecoveryEmail(user, email, recoverString) {
    return new Bluebird(function (resolve, reject) {
        var mailOptions = {
            from: 'Password Recovery <>',
            to: email,
            subject: 'Password Recovery',
            text: '',
            html: ''
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject(error);
                return error;
            }
            var sendBack = {
                email: email,
                message: 'Successfully sent recovery email to ' + email
            };
            resolve(sendBack);
        });
    });
}


function sendEmail(user, email) {
    console.log("send email");
    return new Bluebird(function (resolve, reject) {
        var mailOptions = {
            from: "firstName lastName <email@email.com>",
            to: 'user@email.com',
            subject: "Test Email",
            text: "We are testing emails",
            html: "<div style='height: 500px; width: 100%; margin: 0px; padding: 0px; background: red;'></div> <h3>Test Email</h3>"
        };

        transporter.sendMail(mailOptions, function (error, info) {
            console.log("inside transporter");
            if (error) {
                console.log(error);
            }
            console.log(info);
            resolve(info);
        });
    });
}


function validateEmail(email) {
    return new Bluebird(function (resolve, reject) {
        var query = User.select(User.user_id).where(User.email.equals(email)).toQuery();
        postgres.query(query, function (data) {
            //Ternary operator
            var action = data.rows.length ? resolve : reject;
            action(data.rows[0]);
        });
    });
}


function updatePassword(req, res) {
    req.body.password = utils.encryptPassword(req.body.password);
    updateUser(req.body).then(function (done) {
        postgres.query(User.select(User.star()).where(User.user_id.equals(done.rows[0].user_id)).toQuery(), function (data) {
            res.json(data.rows[0]);
        });
    });
}
exports.updatePassword = updatePassword;
