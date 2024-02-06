var express = require('express');
var router = express.Router();
var userModel = require('../models/users')
const multer = require('multer')
const bcrypt = require('bcrypt')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/images/profile');
  },
  filename: function (req, file, cb) {
      cb(null, new Date().getTime() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single('image'), async function(req, res, next) {
    
    try {
  
        let nameImage = "rambo.jpg"
        if (req.file) {
            nameImage = req.file.filename;
        }
        console.log(req.file);
        const { username, password, firstName, lastName, email } = req.body;
        let hashPassword = await bcrypt.hash(password, 10)
        let newUser = new userModel({
          username: username,
          password: hashPassword,
          firstName: firstName,
          lastName: lastName,
          email: email,
          image: nameImage,
        });
        let users = await newUser.save();
        return res.status(201).send({
            data: users,
            message: "Create Successed",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Create Failed!!",
            success: false,
        });
    }
 
  });


  
  
  
  module.exports = router;
  