var phantom = require('phantom');
var md5 = require('md5');
var qs = require('querystring');

// http://stackoverflow.com/a/13410721/5113832
// http://blog.hubspot.com/marketing/ultimate-guide-social-media-image-dimensions-infographic
// TODO parameter forwarding

var Screenshot = function(onSuccess, onError) {
  var sitepage = null;
  var phInstance = null;
  var fileName = md5(Screenshot.url);
  var path = './temp/' + fileName + '.jpg';
  var params = qs.stringify({ fontSize: Screenshot.fontSize });
  console.log('params: ', params);

  phantom.create()
    .then(function(instance) {
      phInstance = instance;
      return instance.createPage();
    })
    .then(function(page) {
      sitepage = page;
      page.property('viewportSize', { width: Screenshot.width , height: Screenshot.height });
      return page.open(Screenshot.url);
    })
    .then(function(status) {
      console.log(status);
      return sitepage.property('content');
    })
    .then(function(content) {
      console.log(content);
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
    .catch((error) => {
      console.log(error);
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

