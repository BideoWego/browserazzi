var express = require('express');
var app = express();
var screenshot = require('./lib/screenshot');
var bodyParser = require('body-parser');

// ----------------------------------------
// Config
// ----------------------------------------

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

// ----------------------------------------
// Routes
// ----------------------------------------

app.get('/', function(request, response) {
  response.render('index');
});

app.post('/api/v1/screenshot', function(request, response) {
  screenshot.config(request.body);

  screenshot(function(path) {
    response.sendFile(path, { root: __dirname });
    response.end(function() {
      screenshot.remove(path);
    });
  }, function(error) {
    response.json({ error: error });
  });

});


// ----------------------------------------
// Errors
// ----------------------------------------

app.use(function(request, response, next) {
  response.status(404).send('Sorry cant find that!');
});

app.use(function(error, request, response, next) {
  console.error(error.stack);
  response.status(500).send('Something broke!');
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

