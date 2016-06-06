//==============================================================================

var express, fs, bodyParser, request, logger, _, server, app, favicon, passport, LocalStrategy, cookieParser, cron;

express = require('express');
fs = require('fs');
bodyParser = require('body-parser');
request = require('request');
logger = require('morgan');
_ = require('lodash');
favicon = require('serve-favicon');
passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
cookieParser = require('cookie-parser');
cron = require('cron');
var utils = require('./routes/utils.js');
//var Email = require('./routes/emails.js');
app = express();


//FAVICON
//Add a Website Icon to your site
//app.use(favicon('./favicon.ico'))
    //The favicon.ico file must be in the same folder as this file
    //Currently doesn't work in the current version of safari, but it works with firefox and chrome

process.env.TZ = 'utc';
app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});
app.all('/api/v1/*', [require('./middleware/validateRequest')]);
app.use(express.static('public'));
app.use('/', require('./routes'));

//==============================================================================

app.all('/*', function (req, res, next) {
    res.sendFile('index.html', {
        root: 'public/'
    });
});


//A Cron Job that sets backs up the database every day at 4:30 AM
//var job;
//job = new cron.job('00 30 3 * * 1-7', function () {
//        utils.exportDatabase();
//    }, function () {
//        console.log("DONE");
//    },
//    false,
//    'America/Los_Angeles'
//);


//Set the localhost settings to:
app.set('port', process.env.PORT || 3000);
server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
