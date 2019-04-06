var promise = require('bluebird');
const aws = require('aws-sdk');
aws.config.region = 'us-east-1';

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var FileReader = require('filereader');

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
// Get random meme
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

// -------------------------------------------------------
// Post meme
// -------------------------------------------------------

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    console.log(this.response);
    // var fr = new FileReader();

    // fr.onload = function () {
    //   console.log(this.response);
    //   callback(this.response);
    // };
    // fr.readAsDataURL(xhr.response); // async call
  };

  xhr.send();
}


var imgCount = 0;
function sendToS3(img) {
  const s3 = new aws.S3();
  const fileName = "img" + String(imgCount) + ".gif";
  // const fileType = "image/gif";
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Body: img,  
    Key: fileName
  };

  s3.putObject(s3Params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
}

function giveMemePls(req, res, next) {
  toDataURL(req.body.image, function (res) {
    console.log(res);
    sendToS3(req);
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



