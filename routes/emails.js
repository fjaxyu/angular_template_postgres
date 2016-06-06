//var postgres = require('./pgDatabase.js');
//var sql = require('./newdatabase.js');
//var Bluebird = require('bluebird');
//var randomstring = require('randomstring');
//
//var User = require("./user.js");
//var Admin = require("./admin.js");
//
//var nodemailer, transporter;
//nodemailer = require('nodemailer');
//var smtpTransport = require('nodemailer-smtp-transport');
//
//var path = require('path');
//

//
////var EmailTemplate = require('../..').EmailTemplate;
//var EmailTemplate = require('email-templates').EmailTemplate;
//var _ = require('lodash');
//var Handlebars = require('handlebars');
//
//var async = require('async');
//
////var templatesDir = path.resolve(__dirname, '..', 'templates');
////var template = new EmailTemplate(path.join(templatesDir, 'newsletter'));
//
////https://github.com/niftylettuce/node-email-templates/blob/master/examples/nodemailer/index.js
//
//var templateDir = path.resolve(__dirname, '..', 'templates', 'newsletter-hbs');
//
//Handlebars.registerHelper('capitalize', function capitalize(context) {
//    return context.toUpperCase();
//});
//
//Handlebars.registerPartial('name',
//    '{{ name.first }} {{ name.last }}'
//);
//
//var template = new EmailTemplate(templateDir);
//
//function recoverPassword(req, res) {
//    var query = "select user_id FROM users WHERE email = '" + req.params.email.loLowerCase() + "';";
//    postgres.query(query, function (data) {
//        console.log(data);
//        if (data.rows.length > 0) {
//            var recover = makeRecoverString();
//            var user = data.rows[0];
//            user.recoveryString = recover;
//            var query2 = User.update(user).and(User.user_id.equals(user.user_id)).toQuery();
//            postgres.query(query2, function (data) {
//                sendRecoveryEmail(user, req.params.email, recover);
//            });
//        }
//    });
//}
//exports.recoverPassword = recoverPassword;
//
//function makeRecoverString() {
//    var text = "";
//    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//
//    for (var i = 0; i < 5; i++) {
//        text += possible.charAt(Math.floor(Math.random() * possible.length));
//    }
//
//    return text;
//}
//
//function sendRecoveryEmail(user, email, recoverString) {
//    console.log(email);
//    console.log(recoverString);
//
//    var mailOptions = {
//        from: 'Password Recovery <email@email.com>',
//        to: email,
//        subject: 'Password blbkjdflds',
//        text: 'To recover your password follow this link ',
//        html: 'To recover your password follow this link '
//    };
//    transporter.sendMail(mailOptions, function (error, info) {
//        if (error) {
//            console.log(error);
//            return error;
//        }
//        console.log("Message sent: " + info.response);
//        return info.message;
//    });
//}
//
//function sendEmail(file) {
//    return new Bluebird(function (resolve, reject) {
//
//        transporter.sendMail(file, function (error, info) {
//            if (error) {
//                console.log(error);
//                reject(error);
//                return error;
//            }
//            var sendBack = {
//                email: file.to,
//                message: 'Successfully sent recovery email to ' + file.to
//            };
//            resolve(sendBack);
//        });
//    });
//}
//
//
//function sendTestEmail(req, res) {
//    console.log("send test email");
//    template.render(locals).then(function (results) {
//        //        console.log('One user', results);
//        var email = locals.email;
//        sendEmail(7, email, results).then(function (response) {
//            console.log('success?');
//            //        console.log(response);
//            res.json(response);
//        }, function (error) {
//            console.log(error);
//            res.json("what");
//        });
//    });
//}
//exports.sendTestEmail = sendTestEmail;