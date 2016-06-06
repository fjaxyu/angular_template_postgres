var postgres = require('./pgDatabase.js');
var Bluebird = require('bluebird');
var fs = require('fs');
var EasyZip = require('easy-zip').EasyZip;
var zip = new EasyZip();
var bcrypt = require('bcrypt');

function exportDatabase(){
    var query = "SELECT * FROM pg_catalog.pg_tables WHERE schemaname = 'public'";

    postgres.query(query, function(tables){
        return Bluebird.mapSeries(tables.rows, function(table){
            return writeDataToFile(table);
        }).then(function(){
            zipfiles();
        });
    });
}
exports.exportDatabase = exportDatabase;


function writeDataToFile(table){
    return new Bluebird(function(resolve, reject){
      var query = "SELECT * FROM " + table.tablename;
        var path = __dirname.substring(0, __dirname.indexOf('routes')) + 'backups/newest/';
        postgres.query(query, function(data){
            fs.writeFileSync(path + table.tablename + '.json', JSON.stringify(data));
            resolve();
        });
    });
}
exports.writeDataToFile = writeDataToFile;


function zipfiles(){
    var path = __dirname.substring(0, __dirname.indexOf('routes')) + 'backups/newest/';
    console.log(path);
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
    console.log(path);
    fs.readdirSync(path).forEach(function(v){
        fs.unlink(path + v, function(){
            console.log('successfully deleted ' + v);
        });
    });

    fs.readdirSync(path2).forEach(function(file){
        if(file !== filename){
            fs.unlink(path2 + file, function(){
                console.log('successfully deleted ' + file);
            });
        }
    });
}


function importDatabase(){
    //not built out yet
}


function encryptPassword(password){
    return bcrypt.hashSync(password, 10);
}
exports.encryptPassword = encryptPassword;

function validatePassword(password, hashedPassword){
   return bcrypt.compareSync(password, hashedPassword);
}
exports.validatePassword = validatePassword;

function submitFeedback(req, res) {
    console.log("USER - post.submitFeedback");
    var query = Feedback.insert(req.body).toQuery();
    postgres.query(query, function (data) {
        res.json(data);
    });
}
exports.submitFeedback = submitFeedback;
