var screenshot = require('../lib/screenshot');
var validator = require('validator');

// ----------------------------------------
// ScreenshotsController
// ----------------------------------------

ScreenshotsController = {
  make: function(request, response) {
    response.render('layouts/application', {
      view: 'screenshots/form',
      flash: {
        danger: request.flash('error')
      },
      csrfToken: process.env.CSRF_TOKEN
    });
  },


  create: function(request, response) {
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
  }
};


module.exports = ScreenshotsController;

