var express = require('express');
var router = express.Router();
var userModel = require('../models/users')
const multer = require('multer')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const verifyToken = require('../middleware/jwt_decode')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/images');
  },
  filename: function (req, file, cb) {
      cb(null, new Date().getTime() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', verifyToken, async function(req, res, next) {
  try {
        
    let users = await userModel.find()
    return res.status(200).send({
        data: users,
        message: "Successed",
        success: true,
    });
} catch (error) {
    console.error(error);
    return res.status(500).send({
        message: "Sever error",
        success: false,
    });
}
});


router.get("/:id", async function(req, res, next) {
  try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send({
              message: "Invalid product ID",
              success: false,
              error: ["Id is not a ObjectId"]
          });
      }

      let users = await userModel.findById(id);
          return res.status(200).send({
              data: users,
              message: "Successed",
              success: true,
          });
      
     
  } catch (error) {
      console.error(error);
      return res.status(500).send({
          message: "Server error",
          success: false,
      });
  }
});


router.put("/:id", async function(req, res, next) {
  try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send({
              message: "Invalid product ID",
              success: false,
              error: ["Id is not a ObjectId"]
          });
      }

      await userModel.updateOne(
          { _id: new mongoose.Types.ObjectId(id) },
          { $set: req.body }
          );
      let user = await userModel.findById(id);
      return res.status(201).send({
          data: user,
          message: "Successed",
          success: true,
      });    
     
  } catch (error) {
      console.error(error);
      return res.status(500).send({
          message: "Server error",
          success: false,
      });
  }
})

router.delete("/:id", async function(req, res, next) {
  try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send({
              message: "Invalid product ID",
              success: false,
              error: ["Id is not a ObjectId"]
          });
      }

      await userModel.deleteOne(
          { _id: new mongoose.Types.ObjectId(id) }
          );
      let products = await userModel.find();
      return res.status(200).send({
          data: products,
          message: "Delete Successed",
          success: true,
      });    
     
  } catch (error) {
      console.error(error);
      return res.status(500).send({
          message: "Delete fail",
          success: false,
      });
  }
})


router.post("/", upload.single('image'), async function(req, res, next) {
  try {

      let nameImage = "rambo.jpg"
      if (req.file) {
          nameImage = req.file.fieldname
      }
      const { username, password, firstName, lastName, email } = req.body;
      let hashPassword = await bcrypt.hash(password, 10)
      let newUser = new userModel({
        username: username,
        password: hashPassword,
        firstName: firstName,
        lastName: lastName,
        email: email,
        img: nameImage
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
