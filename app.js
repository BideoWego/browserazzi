const express = require('express');
const app = express();


// ----------------------------------------
// App Variables
// ----------------------------------------
app.locals.appName = 'Browserazzi';


// ----------------------------------------
// ENV
// ----------------------------------------
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: [
    process.env.SESSION_SECRET || 'secret'
  ]
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require('express-flash-messages');
app.use(flash());


// ----------------------------------------
// Method Override
// ----------------------------------------
const methodOverride = require('method-override');
const getPostSupport = require('express-method-override-get-post-support');

app.use(methodOverride(
  getPostSupport.callback,
  getPostSupport.options // { methods: ['POST', 'GET'] }
));


// ----------------------------------------
// Referrer
// ----------------------------------------
app.use((req, res, next) => {
  req.session.backUrl = req.header('Referer') || '/';
  next();
});


// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));


// ----------------------------------------
// Logging
// ----------------------------------------
if (process.env.NODE_ENV !== 'test') {
  const morgan = require('morgan');
  const morganToolkit = require('morgan-toolkit')(morgan);

  app.use(morganToolkit());
}


// ----------------------------------------
// Routes
// ----------------------------------------
const screenshot = require('./services/screenshot');

app.get('/', (req, res) => {
  res.render('welcome/index');
});

app.post('/api/v1/screenshots', async (req, res, next) => {
  try {
    const data = await screenshot({
      url: req.body.url,
      width: req.body.width,
      height: req.body.height,
      format: req.body.format,
      quality: req.body.quality,
      logger: process.env.NODE_ENV === 'test' ? null : console.log
    });
    let formattedData = {
      base64: data,
      image_src: `data:image/jpeg;base64,${ data }`,
    }[req.body.format];

    if (!formattedData) {
      formattedData = new Buffer(data, 'base64');
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    }

    res.write(formattedData);
    res.end();
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  helpers: helpers,
  partialsDir: 'views/',
  defaultLayout: 'application'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT ||
  process.argv[2] ||
  3000;
const host = 'localhost';

const args = process.env.NODE_ENV === 'production' ?
  [port] :
  [port, host];

args.push(() => {
  console.log(`Listening: http://${ host }:${ port }\n`);
});

if (require.main === module) {
  app.listen.apply(app, args);
}


// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use((req, res, next) => {
  res.status(404).render('errors/404');
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render('errors/500', { error: err });
});


module.exports = app;






