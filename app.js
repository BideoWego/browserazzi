var express = require('express');
var app = express();
var screenshot = require('./lib/screenshot');
var bodyParser = require('body-parser');
var cors = require('cors');
var validator = require('validator');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// ----------------------------------------
// Config
// ----------------------------------------

app.set('port', process.env.PORT || 4000);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
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


// ----------------------------------------
// Routes
// ----------------------------------------

app.get('/', function(request, response) {
  response.render('layouts/application', {
    view: 'screenshots/form',
    flash: {
      danger: request.flash('error')
    }
  });
});

app.post('/api/v1/screenshot', function(request, response) {

  if (!validator.isURL(request.body.url)) {
    request.flash('error', 'Not a URL');
    response.redirect('/');
  } else {
    screenshot.config(request.body);
    
    screenshot(function(data) {
      if (request.body.format === 'base64') {
        response.write(data);
      } else if (request.body.format === 'image_src') {
        response.render('screenshots/screenshot', {
          title: 'Screenshot of: ' + request.body.url,
          data: data
        });
      } else {
        var image = new Buffer(data, 'base64');
        response.writeHead(200, { 'Content-Type': 'image/jpeg' });
        response.write(image);
      }
      response.end();
    }, function(error) {
      response.json({ error: error });
    });
  }

});


// ----------------------------------------
// Errors
// ----------------------------------------

app.use(function(request, response, next) {
  response.status(404)
    .render('layouts/application', {
      view: 'errors/404'
    });
});

app.use(function(error, request, response, next) {
  console.error(error.stack);
  response.status(500)
    .render('layouts/application', {
      view: 'errors/500'
    });
});


// ----------------------------------------
// Server
// ----------------------------------------

if (require.main === module) {
  var port = app.get('port');
  app.listen(port, function() {
    console.log('Serving at http:localhost:' + port);
  });
} else {
  module.exports = app;
}

