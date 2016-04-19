var phantom = require('phantom');
var qs = require('querystring');
var atob = require('atob');

// http://stackoverflow.com/a/13410721/5113832
// http://blog.hubspot.com/marketing/ultimate-guide-social-media-image-dimensions-infographic
// TODO parameter forwarding

var Screenshot = function(onSuccess, onError) {
  var sitepage = null;
  var phInstance = null;
  var params = qs.stringify({ fontSize: Screenshot.fontSize });

  phantom.create()
    .then(function(instance) {
      phInstance = instance;
      return instance.createPage();
    })
    .then(function(page) {
      sitepage = page;
      page.property('viewportSize', { width: Screenshot.width , height: Screenshot.height });
      if (!Screenshot.url) {
        throw Error("No URL");
      }
      return page.open(Screenshot.url);
    })
    .then(function(status) {
      return sitepage.property('content');
    })
    .then(function(content) {
      var base64 = sitepage.renderBase64('jpg');
      return base64;
    })
    .then(function(result) {
      onSuccess(result);
      sitepage.close();
      phInstance.exit();
    })
    .catch(function(error) {
      onError(error);
      phInstance.exit();
    });
};

Screenshot.config = function(options) {
  options = options || {};
  Screenshot.params = options;
  
  Screenshot.url = options.url;
  Screenshot.width = +options.width || 880 * 2;
  Screenshot.height = +options.height || 440 * 2;
  Screenshot.format = options.format || 'jpg';
  Screenshot.quality = options.quality || '100';
  Screenshot.fontSize = +options.fontSize || 24;
};
Screenshot.config();


module.exports = Screenshot;

