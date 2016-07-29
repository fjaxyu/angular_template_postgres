var logger = require('tracer').colorConsole();
var Bluebird = require('bluebird');
var db = require('../config/database');
var jwt = require('jwt-simple');
var hash = require('sha1');
//var sparkpost = require('../lib/sparkpost');


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
    logger.log('Get Admin Details');
    var myData = {};
    logger.log(req.params.type);
    if (req.params.type === 'all') {
        db.feedback_details.find({}, {
            order: 'feedback_total_unfixed'
        }, function (err, data) {
//            logger.log(data);
            logger.log(err);
            myData.feedback = data[0];
            db.log_details.find({}, {
                order: 'log_total_fixed'
            }, function (err, data2) {
                myData.logs = data2[0];
//                logger.log(myData);
                res.json(myData);
            });
        });
    }
}
exports.getDetails = getDetails;


function getLogDates(req, res) {
    logger.log('GET LOG DATES');
    db.log_due_date_totals.find({}, function (err, data) {
        res.json(data);
    });
}
exports.getLogDates = getLogDates;


function getAdminWeeklySnapshot() {
    return new Bluebird(function (resolve, reject) {
        logger.log('GET Admin Weekly Snapshot');
        var query = 'select * from admin_weekly_snapshot;';
        db.run(query, [], function (err, data) {
            resolve(data[0]);
        });
    });
}
exports.getAdminWeeklySnapshot = getAdminWeeklySnapshot;


function sendAdminSnapshot(req, res){
    db.adminSubscriptions('weekly breakdown', function (err, data) {
            var users = data;
            getAdminWeeklySnapshot().then(function (response) {
//                sparkpost.sendAdminSnapshot(users, response).then(function(response){
//                    res.json(response);
//                }, function(error){
//                    res.json(error);
//                });
            });
        });
}
exports.sendAdminSnapshot = sendAdminSnapshot;


function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}
exports.expiresIn = expiresIn;


function getAdminList(req, res) {
    logger.log('Admin List');
    db.admin.find({}, {
        columns: ['admin_id', 'username']
    }, function (err, data) {
        res.json(data);
    });
}
exports.getAdminList = getAdminList;


function feedbackRead(req, res) {
    logger.log('Feedback Read Update');
    db.feedback.update({
        feedback_id: req.body.feedback
    }, {
        read_by: req.body.admin,
        date_read: req.body.date
    }, function (er, data) {
        res.json(data);
    });
}
exports.feedbackRead = feedbackRead;


function updateFeedback(req, res) {
    logger.log('Update Feedback');
    db.feedback.update({
        feedback_id: req.body.feedback_id
    }, req.body, function (err, data) {
        res.json(data);
    });
}
exports.updateFeedback = updateFeedback;


function login(req, res) {
    logger.log('Admin Login');
    var username = req.body.username;
    var password = hash(req.body.password);
    db.admin.find({
        username: username,
        password: password
    }, {
        columns: ['username', 'type', 'admin_id']
    }, function (err, data) {
        if (data.length !== 0) {
            var newData = data[0];
            // logger.log(newData);
            var user = genToken(data);
            // logger.log(user.token);
            newData.token = user.token;
            res.json(newData);
        } else {
            logger.log(data);
            res.json('combination does not exist');
        }
    });
}
exports.login = login;


function getAdminQuick(req, res) {
    logger.log('Get Admin Quick');
    db.admin_quick_look.find({}, function (err, data) {
        var myData = {};
        myData.quickLook = data;
        db.top_players.find({}, function (err, data2) {
            myData.topPlayers = data2;
            res.json(myData);
        });
    });
}
exports.getAdminQuick = getAdminQuick;


function getFeedback(req, res) {
    logger.log('Get Admin Feedback');
    //Wheaties box ternary operator
    var query = req.params.quantity === 'all' ? {} : {
        feedback_id: req.params.quantity
    };
    db.feedback.find(query, function (err, data) {
        res.json(data);
    });
}
exports.getFeedback = getFeedback;


function getLogs(req, res) {
    logger.log('Get Admin Logs');
    db.logs.find({}, function (err, data) {
        res.json(data);
    });
}
exports.getLogs = getLogs;


function deleteLog(req, res) {
    logger.log('Delete Log');
    db.logs.destroy({
        log_id: req.params.id
    }, function (err, data) {
        res.json('complete');
    });
}
exports.deleteLog = deleteLog;


function getLog(req, res) {
    logger.log('Get Admin Log');
    var id = req.params.id;
    db.logs.find({
        log_id: id
    }, function (err, data) {
        res.json(data);
    });
}
exports.getLog = getLog;


function updateLog(req, res) {
    logger.log('Update Admin Log');
    var l = req.body;
    db.logs.update({
        log_id: l.log_id
    }, l, function (err, data) {
        res.json('Successfully updated!');
    });
}
exports.updateLog = updateLog;


function newLog(req, res) {
    logger.log('Update Admin Log');
    db.logs.insert(req.body, function (err, data) {
        res.json('Successfully created!');
    });
}
exports.newLog = newLog;
