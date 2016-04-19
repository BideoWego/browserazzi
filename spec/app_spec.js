var app = require('../app');
var request = require('request');


describe('App', function() {
  var baseUrl = "http://localhost:8888";
  var server;

  beforeEach(function() {
    runs(function() {
      server = app.listen(8888);
    });
  });

  afterEach(function() {
    server.close();
    server = null;
  });


  it('returns a status code of 200', function(done) {
    request.get(baseUrl, function(error, response, body) {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('matches Browserazzi', function(done) {
    request.get(baseUrl, function(error, response, body) {
      expect(body).toMatch(/Browserazzi/);
      done();
    });
  });
});






