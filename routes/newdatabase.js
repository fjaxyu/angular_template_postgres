var pg = require('pg');
var postgres = require('./pgDatabase.js');

//INSERT YOUR DATABASE URL HERE
var url = '';
//if you are using heroku and have created a new postgres database, you may need to add ?ssl=true to the end of your URL in order for it to work.

pg.connect(url, function (err, client) {
    if (err) {
        throw err;
    }
    console.log('Connected to postgres! Getting schemas...');
});

var sql = require('sql');

exports.users = sql.define({
    name: 'users',
    columns: [
        {name: 'user_id'},
        {name: 'name'},
        {name: 'email'},
        {name: 'password'},
        {name: 'username'},
        {name: 'recoverystring'}
    ]
});


exports.admin = sql.define({
    name: 'admin',
    columns: [
        {name: 'admin_id'},
        {name: 'username'},
        {name: 'password'},
        {name: 'type'},
        {name: 'email'},
        {name: 'name'}
    ]
});


exports.logs = sql.define({
    name: 'logs',
    columns: [
        {name: 'log_id'},
        {name: 'public_message'},
        {name: 'log_message'},
        {name: 'date_found'},
        {name: 'date_fixed'},
        {name: 'public'},
        {name: 'public_title'},
        {name: 'priority'},
        {name: 'device'},
        {name: 'type'},
        {name: 'minutes'},
        {name: 'estimated_minutes'},
        {name: 'fixed'},
        {name: 'assigned_to'},
        {name: 'subgroup'},
        {name: 'group'},
        {name: 'fixed_by'},
        {name: 'date_due'},
        {name: 'created_by'},
        {name: 'updated_by'},
        {name: 'last_updated'}
    ]
});


exports.feedback = sql.define({
    name: 'feedback',
    columns: [
        {name: 'feedback_id'},
        {name: 'type'},
        {name: 'message'},
        {name: 'user_wants_response'},
        {name: 'user_email'},
        {name: 'user_name'},
        {name: 'user_id'},
        {name: 'message_date'},
        {name: 'date_read'},
        {name: 'read_by'},
        {name: 'fixed'},
        {name: 'fixed_by'},
        {name: 'fixed_date'},
        {name: 'admin_comment'}
    ]
});