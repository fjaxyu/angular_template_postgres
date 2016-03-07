//==============================================================================

var express, fs, bodyParser, request, logger, _, server, app, favicon, passport, LocalStrategy, cookieParser;

express = require('express');
fs = require('fs');
bodyParser = require('body-parser');
request = require('request');
logger = require('morgan');
_ = require('lodash');
favicon = require('serve-favicon');
passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
cookieParser = require('cookie-parser')

app = express();

var crypto = require('crypto');

app.use(bodyParser.json({
 limit: '50mb'
}));

app.use(bodyParser.urlencoded({
 limit: '50mb',
 extended: true
}));

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.use(express.static('public'));
app.use('/', require('./routes'));

//==============================================================================

app.all('/*', function(req, res, next) {
  res.sendFile('index.html', { root: 'public/' });
});

//Add a Website Icon to your site
//app.use(favicon(_dirname + '/public/favicon.ico'))


//Set the localhost settings to:
app.set('port', process.env.PORT || 3000);
server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});