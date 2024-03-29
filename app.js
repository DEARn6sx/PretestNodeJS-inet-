
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
require('./db/connect')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var registerRouter = require('./routes/register');
var approveRouter = require('./routes/approve');
var orderRouter = require('./routes/orders');
var app = express();
var cors = require('cors')


const verifyToken = require('./middleware/jwt_decode');
const { register } = require('module');
app.use(cors())

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

const indexPage = path.join(__dirname, 'templates/index.html')
app.get("/homepage", (req,res) => {
  res.status(200)
  res.type('text/html')
  res.sendFile(indexPage)
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users',verifyToken, usersRouter);
app.use('/products', productsRouter);
app.use('/register', registerRouter)
app.use('/approve', approveRouter)
app.use('/orders', orderRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log(process.env.DB_HOST);

module.exports = app;
