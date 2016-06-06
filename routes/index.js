//catches errors and reports them easier in the terminal (I used this for imagemagick)
(function() {
    var childProcess = require('child_process');
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

//================================================================================================================================================

var auth = require('./auth.js');
var user = require('./user.js');
var admin = require('./admin.js');
var utility = require('./utils.js');
//var images = require('./images.js');
//var emails = require('./emails.js');

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var express = require('express');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();

//================================================================================================================================================


//IMAGES
    //Get


    //Post

        
    //Update

        
    //Delete


//AUTH
    //Get
        router.get('/api/v1/user/all', auth.getAll);

    //Post
        router.post('/user/login', auth.login);
    
    //Update

    
    //Delete


//ADMIN
    //Get
    router.post('/admin/login', admin.login);
    router.get('/api/v1/admin/getLogs', admin.getLogs);
    router.get('/api/v1/admin/getLog/:id', admin.getLog);
    router.post('/api/v1/admin/update/log', admin.updateLog);
    router.post('/api/v1/admin/new/log', admin.newLog);
    router.post('/api/v1/admin/feedbackRead', admin.feedbackRead);
    router.post('/api/v1/admin/updateFeedback', admin.updateFeedback);
    router.get('/api/v1/admin/getFeedback/:quantity', admin.getFeedback);
    router.get('/api/v1/admin/getAdminList', admin.getAdminList);
    router.get('/api/v1/admin/getDetails/:type', admin.getDetails);
    

    
//USERS
    //Get
//        router.post('/api/v1/user/uploadProfilePic', multipartMiddleware, user.uploadProfilePic); this is the format required when you want to upload images.
        router.get('/api/v1/user/id/:id', user.getUserByID);
        router.get('/checkForUsers/:email', user.checkForUsers);
    
    //Post
        router.post('/api/user/create', user.create);
        router.post('/password/:email', user.recoverPassword);
        router.post('/passwordReset', user.updatePassword);
    
    //Update
        router.post('/api/v1/user/update', user.update);
    
    //Delete



//EMAILS
    //Get

    //Post


//UTILITIES
    //Post
        router.post('/api/v1/submitFeedback', utility.submitFeedback);


//OTHER
    //Get
        
    
    //Post

        
    //Update

    
    //Delete
    
        
//================================================================================================================================================

module.exports = router;