var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var argv = require('yargs').argv;


// ----------------------------------------
// Application
// ----------------------------------------

var Application = function() {
  var app = express();

  app.set('port', process.env.PORT || argv.p || argv.port || 3000);
  app.set('view engine', 'ejs');
  app.set('views', './views');
  app.use(express.static(__dirname + '/../public'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  app.use(cookieParser("Yeah no maybe so..."));
  app.use(session({
    cookie: { maxAge: 60 * 60 * 24 },
    secret: "Ah ah ah, you didn't say the magic word",
    resave: true,
    saveUninitialized: true
  }));
  app.use(flash());

  return app;
};


module.exports = Application;

