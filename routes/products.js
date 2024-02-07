var express = require("express")
var router = express.Router()
const productModel = require('../models/product'); 
const orderModel = require('../models/orders'); 
const multer = require('multer')
const mongoose = require('mongoose')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/products');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + "_" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/", upload.single('img') ,  async function(req, res, next) {
    try {

        let nameImage = "rambo.jpg"
        if (req.file) {
            nameImage = req.file.filename;
        }
        const { id, product_name, price, amount, order } = req.body;
        let newProduct = new productModel({
            id: id,
            product_name: product_name,
            price: price,
            amount: amount,
            img: nameImage,
            order: order,
        });
        let product = await newProduct.save();
        return res.status(201).send({
            data: product,
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


router.get("/", async function(req, res, next) {
    try {
        
        let products = await productModel.find()
        return res.status(200).send({
            data: products,
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
})

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

        let products = await productModel.findById(id);
            return res.status(200).send({
                data: products,
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

        await productModel.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: req.body }
            );
        let product = await productModel.findById(id);
        return res.status(201).send({
            data: product,
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

        await productModel.deleteOne(
            { _id: new mongoose.Types.ObjectId(id) }
            );
        let products = await productModel.find();
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

router.get("/orders/:id", async function(req, res, next) {
    try {
        let id = req.params.id;

        // Check if the id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                message: "Invalid product ID",
                success: false,
                error: ["Id is not a ObjectId"]
            });
        }

        // Find the product by id
        let product = await productModel.findById(id);

        if (!product) {
            return res.status(404).send({
                message: "Product not found",
                success: false,
            });
        }

        // Find orders with the same product_name
        let orders = await orderModel.find({ product_name: product.product_name });

        return res.status(200).send({
            data: orders,
            message: "Successfully retrieved orders",
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


router.post('/orders/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { order } = req.body;
  
      // Find the product by ID
      let product = await productModel.findById(id);
  
      if (!product) {
        return res.status(404).send({
          message: "Product not found",
          success: false,
        });
      }
  
  
      // Check if order <= amount
      if (order + product.order > product.amount) {
        return res.status(400).send({
          message: "Order quantity cannot exceed product amount.",
          amount_product: `Product amount now is ${product.amount - product.order}`,
          success: false,
        });
      }
  
      // Update the product's order field
      product.order = order + product.order;
  
      // Save the updated product
      await product.save();
  
      // Calculate totalprice
      const totalprice = product.price * order;
  
      // Your logic for creating a new order goes here
      const newOrder = new orderModel({
        product_name: product.product_name,
        amount: order ,
        totalprice: totalprice,
      });
  
      await newOrder.save();
  
      return res.status(200).send({
        message: "Order updated successfully",
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

module.exports = router;