var postgres = require('./pgDatabase.js');
var sql = require('./newdatabase.js');
var Bluebird = require('bluebird');

var jwt = require('jwt-simple');
var hash = require('sha1');

var Admin = sql.admin;
var Logs = sql.logs;
var Feedback = sql.feedback;


function genToken(user) {
    var expires = expiresIn(180); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());
    user.token = token;
    user.expires = expires;
    return user;
}
exports.genToken = genToken;

function getDetails(req, res) {
    console.log("Get Admin Details");
    var myData = {};
    if (req.params.type === "all") {
        var query = "SELECT * FROM feedback_details;";
        postgres.query(query, function (data) {
            myData.feedback = data.rows[0];
            var query2 = "SELECT * FROM log_details;";
            postgres.query(query2, function (data2) {
                myData.logs = data2.rows[0];
                res.json(myData);
            });
        });
    }
}
exports.getDetails = getDetails;

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}
exports.expiresIn = expiresIn;

function getAdminList(req, res) {
    console.log("Admin List");
    var query = "select admin_id, username from admin;";
    postgres.query(query, function (data) {
        console.log("done");
        res.json(data.rows);
    });
}
exports.getAdminList = getAdminList;

function feedbackRead(req, res) {
    console.log("Feedback Read Update");
    var query = "UPDATE feedback SET read_by = " + req.body.admin + ", date_read = to_date('" + req.body.date + "', 'MM/DD/YYYY') WHERE feedback_id = " + req.body.feedback + ";";
    postgres.query(query, function (data) {
        res.json(data);
    });
}
exports.feedbackRead = feedbackRead;

function updateFeedback(req, res) {
    console.log("Update Feedback");
    var query = Feedback.update(req.body).and(Feedback.feedback_id.equals(req.body.feedback_id)).toQuery();
    postgres.query(query, function (data) {
        res.json(data);
    });
}
exports.updateFeedback = updateFeedback;

function login(req, res) {
    console.log("Admin Login");
    var username = req.body.username;
    var password = hash(req.body.password);
    var query = "select u.username, u.type, u.admin_id from admin u WHERE u.username = '" + username + "' AND u.password = '" + password + "';";
    postgres.query(query, function (data) {
        console.log(data.rows.length);
        if (data.rows.length > 0) {
            var user = genToken(data.rows[0]);
            res.json(user);
        } else {
            console.log(data.rows);
            res.json("combination does not exist");
        }
    });
}
exports.login = login;

function getAdminQuick(req, res) {
    console.log("Get Admin Quick");
    var query = "select * from admin_quick_look";
    postgres.query(query, function (data) {
        var query2 = "select * from top_players";
        var myData = {};
        myData.quickLook = data.rows;
        postgres.query(query2, function (data2) {
            myData.topPlayers = data2.rows;
            res.json(myData);
        });

    });
}
exports.getAdminQuick = getAdminQuick;

function getFeedback(req, res) {
    console.log("Get Admin Feedback");
    var query;
    if (req.params.quantity === "all") {
        query = "select * from feedback;";
        postgres.query(query, function (data) {
            res.json(data.rows);
        });
    } else {
        query = "SELECT * FROM feedback WHERE feedback_id = " + req.params.quantity + ";";
        postgres.query(query, function (data) {
            res.json(data.rows[0]);
        });
    }
}
exports.getFeedback = getFeedback;

function getLogs(req, res) {
    console.log("Get Admin Logs");
    var query = "select * from logs";
    postgres.query(query, function (data) {
        res.json(data.rows);
    });
}
exports.getLogs = getLogs;

function deleteLog(req, res) {
    console.log("Delete Log");
    var query = "DELETE FROM logs WHERE log_id = " + req.params.id + ";";
    postgres.query(query, function (data) {
        res.json('complete');
    });
}
exports.deleteLog = deleteLog;


function getLog(req, res) {
    console.log("Get Admin Log");
    var id = req.params.id;
    var query = "select * from logs WHERE log_id = " + id;
    postgres.query(query, function (data) {
        res.json(data.rows);
    });
}
exports.getLog = getLog;



function updateLog(req, res) {
    console.log("Update Admin Log");
    var l = req.body;
    var query = Logs.update(l).where(Logs.log_id.equals(l.log_id)).toQuery();
    postgres.query(query, function () {
        res.json('Successfully updated!');
    });
}
exports.updateLog = updateLog;

function newLog(req, res) {
    console.log("Update Admin Log");
    var l = req.body;
    var query = Logs.insert(l).toQuery();
    console.log(query);
    postgres.query(query, function () {
        res.json('Successfully updated!');
    });
}
exports.newLog = newLog;
