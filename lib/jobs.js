var cron = require('cron');
var constants = require('../config/constants');
var Email = require('./sparkpost');
var utils = require('./utils');

var backUpJob = new cron.CronJob(constants.backUpSchedule, function () {
        utils.exportDatabase();
    }, function () {
        console.log('DONE');
    },
    false,
    'America/Los_Angeles'
);

//var adminWeekly = new cron.CronJob(constants.weeklyEmailSchedule, function () {
//    Email.sendAdminSnapshot();
//},false, 'America/Los_Angeles');


module.exports = {
    backup: backUpJob,
//    adminEmail: adminWeekly
};