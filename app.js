var express = require('express');
var app = express();

// ----------------------------------------
// Config
// ----------------------------------------

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// ----------------------------------------
// Routes
// ----------------------------------------

app.get('/', function(request, response) {
  response.render('index');
});

app.get('/api/v1/screenshot', function(request, response) {
  response.send('I just took your picture! Haha! Ok.. I kid...');
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

