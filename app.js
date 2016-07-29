var express = require('express');
var app = express();
var constants = require('./config/constants');
var massive = require('massive');
var massiveInstance = massive.connectSync({connectionString : constants.connectionString});
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var toobusy = require('toobusy-js');

//If you run node bin/server.js --ignore, it will ignore the security config
var args = require('yargs').argv;
var ignoreSecurity = args.ignore ? true : false;

/**
 * This is our basic config for our app that's need all the time
 * @param app
 */
function configureBasic(app){
    app.set('db', massiveInstance);
//    app.use(favicon('./favicon.ico'));
    app.use(bodyParser.json({
        limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }));
    app.use(express.static('public'));
    app.use('/', require('./routes'));
    app.set('port', process.env.PORT || constants.UNSECURE_PORT);

    //send the angular index.html file to all route requests
    app.all('/*', function (req, res, next) {
        res.sendFile('index.html', {
            root: 'public/'
        });
    });
    return app;
}

/**
 * This configures our app to use all the security features we want
 * @param app
 */
function configureSecurity(app){
    app.enable('trust proxy');
    app.all('/*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });
//    app.all('*', ensureSecure); //UNCOMMENT WHEN YOU HAVE A CERTIFICATE
    app.all('/api/v1/*', [require('./middleware/validateRequest')]);
    return app;
}


/**
 * This is the middleware that forces requests from http to be redirected to https
 * Our unit tests get unhappy because of this. So in the unit tests add a isTest header into each http call
 * @param req -- request object
 * @param res -- response object
 * @param next -- continue processing the request
 * @returns {*}
 */

//UNCOMMENT WHEN YOU HAVE A CERTIFICATE
//function ensureSecure(req, res, next){
//    //IF the request is from HTTPS or it is from our unit tests
//    if(req.secure || req.headers.istest){
//        return next();
//    }
//    
//    var isLocal = req.hostname.indexOf('localhost') >= 0;
//    
//    var redirectUrl = isLocal ?
//    'https://'+req.hostname + ':' + constants.SECURE_PORT +  req.url : 'https://'+req.hostname + req.url;
//
//    res.redirect(redirectUrl);
//}

/**
 * This method determines wtf we do when our server is overwhelmed with requests
 * @param app
 * @returns {*}
 */
function configureTooBusy(app){
    app.use(function(req, res, next) {
        //IF it's too busy or it's from our unit tests
        if (toobusy() && !req.headers.istest) {
            res.send(503, 'Server is too busy right now, sorry. Please come back later');
        } else {
            next();
        }
    });
    return app;
}
/**
 * This is our main configuration method for our app
 * @param app
 * @param ignoreSecurity -- if true it will ignore all security concerns
 */
function configure(app, ignoreSecurity){
    if(!ignoreSecurity){
        configureSecurity(app);
        configureTooBusy(app);
    }
    configureBasic(app);
}


configure(app, ignoreSecurity);

module.exports = app;
