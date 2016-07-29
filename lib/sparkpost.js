//var logger = require('tracer').colorConsole();
//var Bluebird = require('bluebird');
//var randomstring = require('randomstring');
//var Admin = require('../routes/admin.js');
//var key = ''; //your custom key from SparkPost
//
////https://app.sparkpost.com/dashboard
////https://github.com/SparkPost/node-sparkpost
//
//var SparkPost = require('sparkpost');
//var client = new SparkPost(key);
//
//var url = ''; //your custom url
//                example: 'www.facebook.com'
//
//function sendMail(obj, read) {
//    return new Bluebird(function (resolve, reject) {
//        if (read != null) {
//            logger.log(obj);
//        }
//
//        client.transmissions.send(obj, function (err, res) {
//            if (err) {
//                console.log('Error');
//                console.log(err);
//                reject(err);
//            } else {
//                console.log('Email Sent!');
//                resolve(res);
//            }
//        });
//    });
//}
//
////=================================
////ACCOUNT CONFIRMATION
////=================================
//function sendConfirmation(user) {
//    logger.log('Send Confirm Email');
//
//    return new Bluebird(function (resolve, reject) {
//        var link = 'https://' + url + '/confirm/user/' + user.user_id + '/' + user.confirm;
//
//        var emailData = {
//            name: user.name,
//            link: link
//        };
//
//        var obj = {
//            transmissionBody: {
//                content: {
//                    template_id: 'verify-account'
//                },
//                recipients: [{
//                    address: user.email,
//                    substitution_data: emailData
//                }]
//            }
//        };
//
//        sendMail(obj, true).then(function (response) {
//            resolve(response);
//        }, function (error) {
//            reject(error);
//        });
//    });
//}
//exports.sendConfirmation = sendConfirmation;
//
////=================================
////ADMIN SNAPSHOT
////=================================
//function sendAdminSnapshot(users, response) {
//    return new Bluebird(function (resolve, reject) {
//        logger.log('Send Admin Snapshot');
//
//        var recipients = users.map(function (v, i) {
//            return {
//                address: v.email,
//                substitution_data: {
//                    email: v.email,
//                    name: v.name,
//                    assignments: response.admin_assignments,
//                    last_week_logs: response.last_week_logs,
//                    last_week_feedback: response.last_week_feedback,
//                    this_week_logs: response.this_week_logs,
//                    this_week_feedback: response.this_week_feedback
//                }
//            };
//        });
//
//        var obj = {
//            transmissionBody: {
//                content: {
//                    template_id: 'admin-weekly-digest'
//                },
//                recipients: recipients
//            }
//        };
//
//        sendMail(obj).then(function (response) {
//            resolve(response);
//        }, function (error) {
//            reject(error);
//        });
//    });
//}
//exports.sendAdminSnapshot = sendAdminSnapshot;
//
////===
////RECOVER EMAIL
////===
//function sendRecoveryEmail(user, email, recoverString) {
//    return new Bluebird(function (resolve, reject) {
//        var recipients = [
//            {
//                address: email,
//                substitution_data: {
//                    link: 'https://' + url + '/' + recoverString + '/' + user.user_id,
//                    name: user.name
//                }
//            }
//        ];
//
//        var obj = {
//            transmissionBody: {
//                content: {
//                    template_id: 'recover-password'
//                },
//                recipients: recipients
//            }
//        };
//
//        sendMail(obj).then(function (response) {
//            resolve(response);
//        }, function (error) {
//            reject(error);
//        });
//    });
//}
//exports.sendRecoveryEmail = sendRecoveryEmail;
