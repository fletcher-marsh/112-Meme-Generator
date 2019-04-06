var express = require('express');
var router = express.Router();
var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/get_meme_pls', db.getMemePls);
router.post('/give_meme_pls', db.giveMemePls);


module.exports = router;
