//==============================================================================

var server, constants, http, https, toobusy, WORKERS, args, jobs, ignoreSecurity;
var throng = require('throng');
toobusy = require('toobusy-js');
WORKERS = process.env.WEB_CONCURRENCY || 1;
constants = require('../config/constants');
https = require('https');
http = require('http');
process.env.TZ = 'utc';
jobs = require('../lib/jobs');

//If you run node bin/server.js --ignore, it will ignore the security config
args = require('yargs').argv;
ignoreSecurity = args.ignore ? true : false;

/**
 * This function is the start up function for each one of our worker servers
 * The number of worker servers that get spawned is equal to what WORKERS is equal to
 */
function start() {
    var app = require('../app');

    app.listen(app.get('port'), function () {
        console.log('Express server listening on unsecure port ' + app.get('port'));
    });

    //UNCOMMENT WHEN YOU HAVE A CERTIFICATE
    //if (!ignoreSecurity) {
    //    var httpsServer = https.createServer(constants.CREDENTIALS, app);
    //    httpsServer.listen(constants.SECURE_PORT, function () {
    //        console.log('Express server listening on secure port ' + httpsServer.address().port);
    //    });
    //}

    process.on('SIGINT', function () {
        //httpsServer.close(); //UNCOMMENT WHEN YOU HAVE A CERTIFICATE
        toobusy.shutdown();
        process.exit();
    });
}

throng({
    workers: WORKERS,
    lifetime: Infinity,
    start: start
});
