var screenshot = require('../lib/screenshot');
var validator = require('validator');

// ----------------------------------------
// ScreenshotsController
// ---------------------------------------- 

// ----------------------------------------
// Private
// ----------------------------------------

var _createScreenshot = function(request, response) {
  screenshot.config(request.body);
  screenshot(function(data) {
    var formattedData = {
      "base64": data,
      "image_src": 'data:image/jpeg;base64,' + data
    }[request.body.format];
    if (!formattedData) {
      formattedData = new Buffer(data, 'base64');
      response.writeHead(200, { 'Content-Type': 'image/jpeg' });
    }
    response.write(formattedData);
    response.end();
  }, function(error) {
    response.json({ error: error });
  });
};


// ----------------------------------------
// Public
// ----------------------------------------

var ScreenshotsController = {};


ScreenshotsController.make = function(request, response) {
  response.render('layouts/application', {
    view: 'screenshots/form',
    flash: {
      danger: request.flash('error')
    },
    csrfToken: process.env.CSRF_TOKEN
  });
};


ScreenshotsController.create = function(request, response) {
  if (!validator.isURL(request.body.url)) {
    request.flash('error', 'Not a URL');
    response.redirect('/');
  } else {
    _createScreenshot(request, response);
  }
};


module.exports = ScreenshotsController;

