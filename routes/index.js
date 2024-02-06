var express = require('express');
var router = express.Router();
const Users = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', async function(req, res, next) {
  try {
    let { password, username } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).send({
        message: "Username and password are required",
        success: false,
      });
    }

    let user = await Users.findOne({
      username: username,
    });

    if (!user) {
      return res.status(401).send({
        message: "Login failed - User not found",
        success: false,
      });
    }

    const checkPassword =  bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).send({
        message: "Login failed - Incorrect password",
        success: false,
      });
    }

    const { _id, firstName, lastName, email } = user;
    const token = jwt.sign({ _id, firstName, lastName, email }, process.env.JWT_KEY)
    return res.status(201).send({
      data: { _id, firstName, lastName, email, token },
      message: "Login successful",
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
});

module.exports = router;