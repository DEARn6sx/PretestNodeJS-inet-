var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({
    name: 'test555',
    age: 10
  });
});

module.exports = router;
