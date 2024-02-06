var express = require('express');
var router = express.Router();
const Users = require('../models/users')
const bcrypt = require('bcrypt')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', async function(req, res, next) {
  try {
    let { password, username } = req.body
    let user = await Users.findOne({
      username: username,
    })
    if (!user) {
      return res.status(500).send({
        message: "Login fail",
        success: false,
    });
    }
    const checkPassword = await bcrypt.compare(password, user.password); // Fix typo here
    if (!checkPassword) {
      return res.status(500).send({
        message: "Login fail",
        success: false,
    });}
    const { _id, firstName, lastName, email } = user
    return res.status(201).send({
      data: { _id, firstName, lastName, email},
      message: "Login Successed",
      success: true,
    })
    
  } catch (error) {
    return res.status(500).send({
      message: "Login fail",
      success: false,
  });
  }
});

module.exports = router;
