var phantom = require('phantom');
var md5 = require('md5');
var qs = require('querystring');
var fs = require('fs');

// http://stackoverflow.com/a/13410721/5113832
// http://blog.hubspot.com/marketing/ultimate-guide-social-media-image-dimensions-infographic
// TODO parameter forwarding

var Screenshot = function(onSuccess, onError) {
  var sitepage = null;
  var phInstance = null;
  var fileName = md5(Screenshot.url);
  var path = './temp/' + fileName + '.jpg';
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
      return sitepage.render(path, {
        format: Screenshot.format,
        quality: Screenshot.quality
      });
    })
    .then(function(result) {
      onSuccess(path)
      sitepage.close();
      phInstance.exit();
    })
    .catch(function(error) {
      onError(error);
      Screenshot.remove(path);
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

Screenshot.remove = function(path) {
  fs.unlinkSync(path);
};


module.exports = Screenshot;

