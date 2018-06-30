const phantom = require('phantom');
const _ = require('lodash');


const _defaults = {
  width: 880 * 2,
  height: 440 * 2,
  format: 'jpg',
  quality: '100'
};

const _log = (...args) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...args);
  }
};


const Screenshot = async (url, options) => {
  options = _.merge(_defaults, options);

  _log('### Screenshot ###');

  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', data => {
    _log('  Requesting: ', data.url);
  });

  await page.property('viewportSize', {
    width: options.width,
    height: options.height
  });
  _log(`  Viewport: ${ options.width }x${ options.height }`);

  const status = await page.open(url);
  _log('  Status: ', status);

  await page.property('content');
  _log('  Content retrieved.');

  const base64 = await page.renderBase64('jpg');
  _log('  Content rendered to base64');

  await page.close();
  await instance.exit();

  return base64;
};




module.exports = Screenshot;
