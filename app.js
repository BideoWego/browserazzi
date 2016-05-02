// ----------------------------------------
// App
// ----------------------------------------

var app = require('./config/application')();
var environment = require('./config/environment')(app);
var routes = require('./config/routes')(app);
var errors = require('./config/errors')(app);
var app = require('./config/server')(app);

module.exports = app;

