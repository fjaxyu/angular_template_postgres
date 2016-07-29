var images = require('./images.js');
var auth = require('./auth.js');
var hash = require('sha1');
var Bluebird = require('bluebird');
var utils = require('../lib/utils.js');
var logger = require('tracer').colorConsole();
var db = require('../config/database');

//Checks the database to see if the user's email already exists
//CHECK FOR USERS
function checkForUsers(req, res) {
    logger.trace(req.route.path);
    db.users.findOne({
        email: req.params.email
    }, function (err, data) {
        if (!data) {
            res.json('okay');
        } else {
            res.json('email exists');
        }
    });
}
exports.checkForUsers = checkForUsers;

//SUBMIT FEEDBACK
function submitFeedback(req, res) {
    logger.trace(req.route.path);
    db.feedback.insert(req.body, function (err, data) {
        res.json(data);
    });
}
exports.submitFeedback = submitFeedback;

//CREATE USER 
function create(req, res) {
    logger.trace(req.route.path);
    var user = {
        password: utils.encryptPassword(req.body.password),
        name: req.body.name,
        email: req.body.email,
        confirm: utils.generateConfirmString()
    };

    logger.log(user);

    db.users.insert(user, function (err, data) {
        console.log(data);
        res.json(data);
    });
}
exports.create = create;

function update(req, res) {
    logger.trace(req.route.path);
    db.users.update({
        user_id: req.body.user_id
    }, req.body, function (err, data) {
        res.json(data);
    });
}
exports.update = update;


function getUserByID(req, res) {
    logger.trace(req.route.path);
    db.users.findOne({
        user_id: req.params.id
    }, function (err, data) {
        res.json(data);
    });
}
exports.getUserByID = getUserByID;