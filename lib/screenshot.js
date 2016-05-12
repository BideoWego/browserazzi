var phantom = require('phantom');
var logger = require('logops');
var _ = require('lodash');


// http://stackoverflow.com/a/13410721/5113832
// http://blog.hubspot.com/marketing/ultimate-guide-social-media-image-dimensions-infographic
// TODO parameter forwarding


var _page;
var _phantomInstance;
var _callbacks = {};


var _initialize = function(instance) {
  logger.info('Instantiating PhantomJS and page ');
  _phantomInstance = instance;
  return instance.createPage();
};


var _open = function(page) {
  var size = { width: Screenshot.width , height: Screenshot.height };
  logger.info('Page created setting viewportSize: %j', size);
  _page = page;
  _page.property('viewportSize', size);
  logger.info('Opening URL for screenshot: %s', Screenshot.url);
  return _page.open(Screenshot.url);
};


var _getContent = function(status) {
  logger.info('URL opened with status: %s', status);
  return _page.property('content');
};


var _render = function(content) {
  logger.info('Rendering content');
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      var base64 = _page.renderBase64('jpg');
      resolve(base64);
    }, 750);
  });
};


var _onSuccess = function(result) {
  logger.info('Returning rendered result');
  _callbacks.onSuccess(result);
  _page.close();
  _phantomInstance.exit();
};


var _onError = function(error) {
  logger.error(error);
  _callbacks.onError(error.toString());
  _phantomInstance.exit();
};


var Screenshot = function(onSuccess, onError) {
  _callbacks.onSuccess = onSuccess;
  _callbacks.onError = onError;

  logger.info('--- Screenshot Begin ---');

  phantom.create()
    .then(_initialize)
    .then(_open)
    .then(_getContent)
    .then(_render)
    .then(_onSuccess)
    .catch(_onError)
    .then(function() {
      logger.info('--- Screenshot End ---');
    });
};


Screenshot.config = function(options) {
  options = options || {};
  
  Screenshot.url = options.url;
  Screenshot.width = +options.width || 880 * 2;
  Screenshot.height = +options.height || 440 * 2;
  Screenshot.format = options.format || 'jpg';
  Screenshot.quality = options.quality || '100';
};


module.exports = Screenshot;




