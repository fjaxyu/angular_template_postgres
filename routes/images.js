//var postgres = require('./pgDatabase.js');
//var sql = require('./newdatabase.js');
//var amazonS3 = require('awssum-amazon-s3');
//var Bluebird = require('bluebird');
//var Upload = require('s3-uploader');
//var Delete = require('./delete.js');
//
//var Images = sql.images;
//
//
//var amazonS3 = require('awssum-amazon-s3');
//var s3 = new amazonS3.S3({
//    'accessKeyId': '', //your access key id
//    'secretAccessKey': '', //your secret access key
//    'region': '', //your region
//    'path': '' //where you'd like to store your uploaded files (eg. 'images/' or 'files/')
//});
//
//
//var client = new Upload('artlineup', {
//    aws: {
//        path: '', //where you'd like to store your uploaded files (eg. 'images/' or 'files/')
//        region: '', //your region
//        acl: 'public-read', //type of privacy
//        accessKeyId: '', //your access key id
//        secretAccessKey: '' //your secret access key
//    },
//    cleanup: {
//        versions: true
//    },
//
//    versions: [{
//            maxHeight: 1040,
//            maxWidth: 1040,
//            quality: 70,
//            suffix: 'normal'
//    },
//        {
//            maxHeight: 260,
//            maxWidth: 260,
//            quality: 70,
//            suffix: 'thumb'
//        },
//    ]
//});
//
////===================================
////CURRENT UPLOAD WITH PROMISES
////===================================
//
//var uploadNewImages = function (req) {
//    console.log('upload new images');
//    return new Bluebird(function (resolve, reject) {
//        var imgObj = {};
//        imgObj.entity_id = req.body.entity_id;
//        imgObj.entity_type = req.body.entity_type;
//        if (typeof req.files.file === "undefined") {
//            console.log("no image files");
//            resolve(imgObj);
//        } else {
//            console.log('images found');
//            return Bluebird.mapSeries(req.files.file, function (f, index) {
//                return upload(f, imgObj);
//            }).then(function () {
//                console.log('done uploading');
//                resolve(imgObj);
//            });
//        }
//    });
//
//};
//exports.uploadNewImages = uploadNewImages;