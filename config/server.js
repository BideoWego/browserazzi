// ----------------------------------------
// Server
// ----------------------------------------

var Server = function(app) {

  var mainFilename = require
    .main
    .filename
    .split('/')
    .reverse()[0];

  if (mainFilename === 'app.js') {
    var port = app.get('port');
    app.listen(port, function() {
      console.log('Serving at http:localhost:' + port);
    });
  }

  return app;
};


module.exports = Server;


