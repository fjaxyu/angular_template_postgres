var fs = require('fs');

var key_name = ''; //without the file type (example: www_facebook_me)

//var privateKey  = fs.readFileSync('./config/certs/' + key_name + '.key'); //UNCOMMENT WHEN YOU HAVE A CERTIFICATE
//var certificate = fs.readFileSync('./config/certs/' + key_name + '.pem'); //UNCOMMENT WHEN YOU HAVE A CERTIFICATE
//var credentials = {key: privateKey, cert: certificate}; //UNCOMMENT WHEN YOU HAVE A CERTIFICATE

module.exports = {
    connectionString: '', //your postgres database. If you use Heroku as a host, make sure to add ?ssl=true to the end of the url.
    
    backUpSchedule: '00 30 3 * * 1-7', //The backup schedule
    
//    weeklyEmailSchedule: '00 00 11 * * 5', //How often weekly emails are sent to admins
    
    SECURE_PORT: 4000, //the port of localhost that HTTPS is hosted at
    
    UNSECURE_PORT: process.env.PORT || 3000, //the port of localhost that HTTP is hosted at
//    CREDENTIALS : credentials
    
};

