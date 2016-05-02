var ScreenshotsController = require('../controllers/screenshots_controller');


// ----------------------------------------
// Routes
// ----------------------------------------

var Routes = function(app) {

  app.get('/', ScreenshotsController.make);
  app.post('/api/v1/screenshot', ScreenshotsController.create);

};


module.exports = Routes;



