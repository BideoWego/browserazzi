// ----------------------------------------
// Environment
// ----------------------------------------

var Environment = function(app) {

  if (app.settings.env === 'development') {
    require('../env');
  }

  return this;
};

module.exports = Environment;

