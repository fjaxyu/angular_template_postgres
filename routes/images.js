//var sql = require('./newdatabase.js');
//var amazonS3 = require('awssum-amazon-s3');
//var Bluebird = require('bluebird');
//var Upload = require('s3-uploader');
//var Delete = require('./delete.js');
//
//var Images = sql.images;
//
//var accessKeyId = ''; //your access key id
//var secretAccessKey = ''; //your secret access key
//var region = ''; //your region
//var path = ''; //where you'd like to store your uploaded files (eg. 'images/' or 'files/')
//var acl = 'public-read' //type of privacy
//
//var amazonS3 = require('awssum-amazon-s3');
//var s3 = new amazonS3.S3({
//    'accessKeyId': accessKeyId,
//    'secretAccessKey': secretAccessKey,
//    'region': region,
//    'path': path
//});
//
//
//var client = new Upload('artlineup', {
//    aws: {
//        path: path, 
//        region: region, 
//        acl: 'public-read',
//        accessKeyId: accessKeyId, 
//        secretAccessKey: secretAccessKey 
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
//    logger.log('upload new images');
//    return new Bluebird(function (resolve, reject) {
//        var imgObj = {};
//        imgObj.entity_id = req.body.entity_id;
//        imgObj.entity_type = req.body.entity_type;
//        imgObj.changed = true;
//        
//        if (req.files.file == null) {
//            logger.log('no image files');
//            resolve(imgObj);
//        } else {
//            logger.log('images found');
//            return Bluebird.mapSeries(req.files.file, function (f, index) {
//                if (index === 0) {
//                    imgObj.is_display_image = true;
//                } else {
//                    imgObj.is_display_image = false;
//                }
//                return upload(f, imgObj);
//            }).then(function () {
//                logger.log('done uploading');
//                resolve(imgObj);
//            });
//        }
//    });
//
//};
//exports.uploadNewImages = uploadNewImages;