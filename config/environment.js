var crypto = require('crypto');

// ----------------------------------------
// Environment
// ----------------------------------------

var Environment = function(app) {

  if (app.settings.env !== 'production') {
    require('dotenv').config();
  }

  var secret = process.env.SECRET;

  if (!secret) {
    throw new Error('Secret token not set');
  }

  process.env.CSRF_TOKEN = crypto.Hmac('md5', 'salt and pepper' + secret)
    .digest('hex');

  return this;
};

module.exports = Environment;

