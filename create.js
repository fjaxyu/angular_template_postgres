var postgres = require('./routes/pgDatabase.js');

console.log('Creating Admin.');

var query = "create table admin (admin_id serial, username text, name text, password text, email text, type text, primary key (admin_id));";
postgres.query(query, function(data){
    
    console.log('Done. Creating Users.');
    
    var query2 = "create table users (user_id serial, username text, name text, email text, password text, recoverystring text, primary key (user_id));";
    postgres.query(query2, function(data){
    
        console.log('Done. Creating Logs.');
        
        var query3 = "create table logs (log_id serial, public_message text, log_message text, date_found date, date_fixed date, public boolean, public_title text, priority text, device text, type text, minutes integer, estimated_minutes integer, fixed boolean, assigned_to text, subgroup text, group text, fixed_by text, date_due date, created_by text, updated_by text, last_updated date, primary key (log_id));";
        postgres.query(query3, function(data){
        
            console.log('Done. Creating Feedback.');
            
            var query4 = "create table feedback (feedback_id serial, type text, message text, user_wants_response boolean, user_email text, user_name text, user_id integer, message_date date, date_read date, read_by text, fixed boolean, fixed_by text, fixed_date date, admin_comment text, primary key (feedback_id));";
            postgres.query(query4, function(data){
                
                console.log('Success! All tables created!');
                
            })
        })
    })
})