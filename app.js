var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var TwitterBot = require('twit');

// Set up auth tokens and such
const dotenv = require('dotenv');
dotenv.config();
console.log(`Your port is ${process.env.ACCESS_TOKEN}`)

var indexRouter = require('./routes/index');

var app = express();

// add headers to allow swagger docs to query
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Set up twitter bot
var tBot = new TwitterBot({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

function random_from_array(images) {
  return images[Math.floor(Math.random() * images.length)];
}

function upload_random_image(images, mc) {
  var image_path = path.join(__dirname, '/images/' + random_from_array(images)),
    b64content = fs.readFileSync(image_path, { encoding: 'base64' });


  tBot.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err) {
      console.log('ERROR:');
      console.log(err);
    }
    else {
      console.log('Image uploaded!');
      console.log('Now tweeting it...');

      tBot.post('statuses/update', {
        status: "Meme #"+String(mc),
        media_ids: new Array(data.media_id_string)
      },
        function (err, data, response) {
          if (err) {
            console.log('ERROR:');
            console.log(err);
          }
          else {
            console.log('Posted an image!');
          }
        }
      );
    }
  });
}

// Every 10 minutes, kick off a meme creation
var memeCount = 0;
var minutes = 0.25;
setInterval(function () {
  var files = fs.readdirSync('./images');
  var images = [];
  files.forEach(function (f) {
    images.push(f);
  });
  upload_random_image(images, memeCount);
  memeCount++;
  console.log(files);
}, 5 * 1000)

module.exports = app;

