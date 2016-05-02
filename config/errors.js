// ----------------------------------------
// Errors
// ----------------------------------------

var Errors = function(app) {

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

  return this;
};


module.exports = Errors;

