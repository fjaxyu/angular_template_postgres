var pg = require('pg');

//INSERT YOUR DATABASE URL HERE
var url = "";
//if you are using heroku and have created a new postgres database, you may need to add ?ssl=true to the end of your URL in order for it to work.

var client = new pg.Client(url);

module.exports = {
	getRetToJSCONString : function(){
        return retToJSONString;
    },
	getConString : function(){
		return url;
	},
	query: function(queryToExecute, queryDone){
		pg.connect(url, function(err, client, done) {
			var handleError = function(err,client,done) {
				// no error occurred, continue with the request
				if(!err) {
                    return false;
                }
				
				// An error occurred, remove the client from the connection pool.
				// A truthy value passed to done will remove the connection from the pool
				// instead of simply returning it to be reused.
				// In this case, if we have successfully received a client (truthy)
				// then it will be removed from the pool.
				if(client){
					done(client);
				}
//				res.flash(err);
				
//				res.flash('An error occurred fetching from pool');
				return true;
			};
            
			// handle an error from the connection
			if(handleError(err,client,done)) {
                return err;
            }
					
			client.query(queryToExecute, function(err,result){
				done(client); ///release the client back to the pool before we move on
				if(handleError(err)){
                    console.log("ERROR");
                    console.log(err);
					return;
				}
				///return the result of the query
				queryDone(result);
			});
		});
	}	
};