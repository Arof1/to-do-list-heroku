const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const pg_session = require('connect-pg-simple')(session);
const routes = require('./routes');
const usersRouter = require('./routes/users');
const config = require('./config');
const app = express();
const db = require('./db')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    store: new pg_session({
        pool : db.pool,                // Connection pool
    }),
    secret: 'dk;asjhbdiasgdausida',
    resave: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}))


app.get('/', (req, res) => {
    if (req.session.userId) {
        db.query('SELECT id, first_name, second_name FROM users WHERE manager_id = $1', [req.session.userId], (err, result) => {
            let subordinates = result.rows;
            db.query(`SELECT id, title, status, deadline
                           FROM tasks
                           WHERE creator_id = $1 OR performer_id = $1 ORDER BY update_date`,
                [req.session.userId], (err, result) => {
                    let tasks = result.rows;
                    db.query('SELECT id, login, first_name, second_name, patronymic FROM users WHERE id = $1', [req.session.userId], (err, result) => {
                        res.render('index', {
                            user: result.rows[0],
                            is_logged: true,
                            subordinates: subordinates,
                            tasks: tasks
                        })
                    })
                })
        })
    }
    else {
        db.query('SELECT id, first_name, second_name FROM users', [], (err, result) => {
            console.log(result.rows);
            let users = result.rows
            res.render('index', {
                is_logged: false,
                users: users
            })
        })

    }


});
app.use('/auth', routes.auth);
app.use('/users', usersRouter);
app.use('/tasks', routes.tasks);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
