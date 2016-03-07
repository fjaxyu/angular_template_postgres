var pg = require('pg');



//ADD POSTGRES URL HERE
var url = ""
//



pg.connect(url, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');
  
});

var sql = require('sql');

//ADMIN EXAMPLE
//exports.admin = sql.define({
//    columns: [
//        { name: 'admin_id' },
//        { name: 'admin_username' },
//        { name: 'admin_password' }
//    ]
//})

