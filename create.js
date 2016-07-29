var db = require('./config/database.js');

var queries = [
    'create table admin (admin_id serial, username text, name text, password text, email text, type text, primary key (admin_id));',

    'create table users (user_id serial, username text, name text, email text, password text, recoverystring text, primary key (user_id));',

    'create table logs (log_id serial, public_message text, log_message text, date_found date, date_fixed date, public boolean, public_title text, priority text, device text, type text, minutes integer, estimated_minutes integer, fixed boolean, assigned_to text, subgroup text, \"group\" text, fixed_by text, date_due date, created_by text, updated_by text, last_updated date, primary key (log_id));',

    'create table feedback (feedback_id serial, type text, message text, user_wants_response boolean, user_email text, user_name text, user_id integer, message_date date, date_read date, read_by text, fixed boolean, fixed_by text, fixed_date date, admin_comment text, primary key (feedback_id));',
    
    'create view LOG_MINUTE_BREAKDOWN AS SELECT (max(logs.date_fixed) - min(logs.date_found)) AS working_days, sum(logs.minutes) AS total_minutes, (((sum(logs.minutes) / (max(logs.date_fixed) - min(logs.date_found))))::double precision / (60)::double precision) AS hours_per_day, ((((sum(logs.minutes) / (max(logs.date_fixed) - min(logs.date_found))) * 7))::double precision / (60)::double precision) AS hours_per_week, (((((sum(logs.minutes) / (max(logs.date_fixed) - min(logs.date_found))) * 365) / 12))::double precision / (60)::double precision) AS hours_per_month FROM logs;',
    
    'create view log_due_date_totals as SELECT to_char((logs.date_due)::timestamp with time zone, \'MM/DD/YYYY\'::text) AS due_date, count(*) AS count, ((sum(logs.estimated_minutes))::double precision / (60)::double precision) AS estimated_hours, (((sum(logs.estimated_minutes) / 60))::double precision / ( SELECT log_minute_breakdown.hours_per_day FROM log_minute_breakdown)) AS estimated_days, to_char((now() + (\'1 day\'::interval day * (((sum(logs.estimated_minutes) / 60) / (( SELECT log_minute_breakdown.hours_per_day FROM log_minute_breakdown))::integer))::double precision)), \'MM/DD/YYYY\'::text) AS deadline FROM logs WHERE (((logs.fixed IS NULL) OR (logs.fixed = false)) AND (logs.date_due IS NOT NULL)) GROUP BY logs.date_due ORDER BY to_char((logs.date_due)::timestamp with time zone, \'MM/DD/YYYY\'::text);'
];

function insert(i, end) {
    db.run(queries[i], function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            i = i + 1;
            console.log('Created ' + i + ' of ' + end + ' of tables');
            if (i < end) {
                insert(i, end);
            } else {
                console.log('complete');
            }
        }
    });
}

insert(0, queries.length);
