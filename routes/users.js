var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({
    name: 'test555',
    age: 10
  });
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  // params url , params query , body , headers

  let {
    id
  } = req.params

  let {
    search,
    limit
  } = req.query

  let {
    name
  } = req.body

  let {
    test
  } = req.headers

  res.send({
      id: id,
      query: {
        search,
        limit
      },
      body: {
        ...req.body
      },
      header: test
  });
});

module.exports = router;
