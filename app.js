var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); 
var util= require('util');
var encoder = new util.TextEncoder('utf-8');
var mongoose = require('mongoose');


var app = express();

// Cors 
app.use(cors());

app.use((req, res, next) => {
  console.log('==>after app use');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token',
  );
  res.header(
    'Access-Control-Expose-Headers',
    'Content-Disposition, x-access-token',
  );
  res.header('Access-Control-Allow-Credentials', true); // If needed
  if (req.method === 'OPTIONS') {
    //  respond with 200
    res.sendStatus(200);
  } else {
    next();
  }
});

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/////Mongo Db Setup
var configData = require('./config/database');

mongoose.connect(configData.mongoDbUrl,{
  useNewUrlParser : true,
  useUnifiedTopology: true
})
.then(()=>{
   console.log("MongoDB Conntected Successfully..")}
     )
.catch(err=>{
   console.log("Error In Connecting MongoDB "+err);
    exit(1);
})


var clientRouter = require('./routes/client.Router');
var eventRouter = require('./routes/event.Router');

// var usersRouter = require('./routes/users.Router');
// var memberRouter = require('./routes/members.Router');
// var categorieRouter = require('./routes/categorie.Router');
// var brandRouter = require('./routes/brand.Router');
// var productRouter = require('./routes/product.Router');
// var bannersRouter = require('./routes/banners.Router');
// var cartRouter = require('./routes/cart.Router');
// var accountRouter = require("./routes/account.Router");



app.use('/', indexRouter);
app.use('/api/client/', clientRouter);
app.use('/api/event/', eventRouter);
// app.use('/users', usersRouter);
// app.use('/api/user', usersRouter);
// app.use('/api/member', memberRouter);
// app.use('/api/categorie', categorieRouter);
// app.use('/api/account', accountRouter);
// app.use('/api/brand', brandRouter);
// app.use('/api/product', productRouter);
// app.use('/api/banner', bannersRouter);
// app.use('/api/cart', cartRouter);

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

module.exports = app;
