//catches errors and reports them easier in the terminal (I used this for imagemagick)
(function() {
    var childProcess = require("child_process");
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

var user = require('./user.js');
var multer = require('multer');
var express = require('express');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router()

//CUSTOMERS
router.get('/get/customers/', user.get);


module.exports = router







