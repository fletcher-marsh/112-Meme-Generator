var promise = require('bluebird');
var cv = require('opencv');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var FileReader = require("filereader");
var dl = require("download");

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString;
if (process.env.NODE_ENV === "production") {
  const { DATABASE_URL } = process.env
  connectionString = DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/meme112'; 
}
var db = pgp(connectionString);


// -------------------------------------------------------
// Get meme
// -------------------------------------------------------

function getMemePls(req, res, next) {
  db.any('SELECT * FROM memes ORDER BY RANDOM() LIMIT 1')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data[0]
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('get', url);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    var fr = new FileReader();

    fr.onload = function () {
      callback(this.result);
    };
    console.log(xhr);
    fr.readAsDataURL(xhr.responseText); // async call
  };

  xhr.send();
}

function giveMemePls(req, res, next) {
  dl(req.body.image, "images", "image/jpg");
  cv.readImage(req.body.image, function (err, im) {
    // console.log(req);
    console.log(im);
  });
  db.none('insert into memes (image)' +
      'values(${image})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}




module.exports = {
  getMemePls: getMemePls,
  giveMemePls: giveMemePls
};



