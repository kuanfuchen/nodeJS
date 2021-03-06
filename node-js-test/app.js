var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var auth = require('./routes/auth')
var index = require('./routes/index');
var dashboard = require('./routes/dashboard');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

// bodyparser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  express: true
}));
// 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// express-session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 100 * 1000
  }
}));
app.use(flash());

// const authCheck = function (req, res, next) {
//   console.log('middleware', req.session);
//   if (req.session.uid) {
//     return next();
//   }
//   return res.redirect('/auth/signin')
// }

// routes
app.use('/', index);
app.use('/dashboard', dashboard); //, authCheck
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  res.render('error', {
    title: '你輸入的網頁不存在'
  })

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