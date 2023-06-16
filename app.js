var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');
const { Console } = require('console');
const bodyParser = require('body-parser');

var app = express();

app.use(session({
  secret : 'webslesson',
  resave : true,
  saveUninitialized : true
}));

var cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({ extended: false }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


    


app.listen('1236', function(req, res) {
  console.log("App running on port: 1236")
})



module.exports = app;