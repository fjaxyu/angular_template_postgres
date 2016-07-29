var logger = require('tracer').colorConsole();
var Bluebird = require('bluebird');
var db = require('../config/database');
var fs = require('fs');
var EasyZip = require('easy-zip').EasyZip;
var zip = new EasyZip();
var bcrypt = require('bcrypt');

function exportDatabase(){
    db.getTableNames(function(err, tables){
        return Bluebird.mapSeries(tables, function(table){
            return writeDataToFile(table);
        }).then(function(){
            zipfiles();
        });
    });
}
exports.exportDatabase = exportDatabase;



function writeDataToFile(table){
    return new Bluebird(function(resolve, reject){
        var query = 'SELECT * FROM ' + table.tablename;
        var path = __dirname.substring(0, __dirname.indexOf('routes')) + 'backups/newest/';
        db[table.tablename].find({}, function(err, data){
            fs.writeFileSync(path + table.tablename + '.json', JSON.stringify(data));
            resolve();
        });
    });
}
exports.writeDataToFile = writeDataToFile;


function zipfiles(){
    var path = __dirname.substring(0, __dirname.indexOf('routes')) + 'backups/newest/';
    logger.log(path);
    zip = new EasyZip();
    var files = fs.readdirSync(path).map(function(p){
        return {source: path + p, target: p};
    });
    var date = new Date();
    var fileName = (1900 + date.getYear()) + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    fileName += '-' + date.getHours() + '_' + date.getMinutes() + '.zip';
    zip.batchAdd(files,function(){
        zip.writeToFile(path.substring(0, path.indexOf('newest')) + '/' + fileName);
    });
    clearFiles(fileName);
}


function clearFiles(filename){
    var path = __dirname.substring(0, __dirname.indexOf('routes')) + 'backups/newest/';
    var path2 = __dirname.substring(0, __dirname.indexOf('routes')) + 'backups/';
    logger.log(path);
    fs.readdirSync(path).forEach(function(v){
        fs.unlink(path + v, function(){
            logger.log('successfully deleted ' + v);
        });
    });

    fs.readdirSync(path2).forEach(function(file){
        if(file !== filename){
            fs.unlink(path2 + file, function(){
                logger.log('successfully deleted ' + file);
            });
        }
    });
}

function generateConfirmString(){
    var confirm = (bcrypt.hashSync(Math.floor((Math.random() * 1000000) + 1).toString(), 1).replace(/\W/g,'')).substring(0, 20);
    return confirm;
}
exports.generateConfirmString = generateConfirmString;

function encryptPassword(password){
    return bcrypt.hashSync(password, 10);
}
exports.encryptPassword = encryptPassword;

function validatePassword(password, hashedPassword){
   return bcrypt.compareSync(password, hashedPassword);
}
exports.validatePassword = validatePassword;
