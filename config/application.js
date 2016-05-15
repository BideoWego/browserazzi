var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var argv = require('yargs').argv;
var expressLogging = require('express-logging');
var logger = require('logops');


// ----------------------------------------
// Application
// ----------------------------------------

var Application = function() {
  var app = express();

  app.set('port', process.env.PORT || argv.p || argv.port || 4000);
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

  if (app.settings.env === 'test') {
    logger.setLevel('FATAL');
  }

  app.use(expressLogging(logger));
  app.use(function(request, response, next) {
    if (!_.isEmpty(request.params)) {
      logger.info('Params: %j', request.params);
    }
    if (!_.isEmpty(request.query)) {
      logger.info('Query: %j', request.query);
    }
    if (!_.isEmpty(request.body)) {
      logger.info('Body: %j', request.body);
    }
    next();
  });

  return app;
};


module.exports = Application;

