var promise = require('bluebird');

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


function giveMemePls(req, res, next) {
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



