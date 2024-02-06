var express = require("express")
var router = express.Router()
const productModel = require('../models/product'); 
const orderModel = require('../models/orders'); 
const multer = require('multer')
const mongoose = require('mongoose')



router.get("/", async function(req, res, next) {
    try {
        
        let orders = await orderModel.find()
        return res.status(200).send({
            data: orders,
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
                message: "Invalid order ID",
                success: false,
                error: ["Id is not a ObjectId"]
            });
        }

        let orders = await orderModel.findById(id);
            return res.status(200).send({
                data: orders,
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



// Helper function to update productModel based on order changes
async function updateProductModel(id, newAmount) {
    // Find the corresponding product using orderId or any other relevant logic
    const product = await productModel.findOne({ /* Your condition to find the product */ });

    if (!product) {
        console.error("Product not found");
        return;
    }

    // Update the productModel based on order changes
    product.amount = newAmount;  // Adjust this based on your product model structure
    await product.save();
}

router.post("/", async function(req, res, next) {
    try {
        const { order_name, amount } = req.body;
        let newOrder = new orderModel({
            order_name: order_name,
            amount: amount,
        });
        let order = await newOrder.save();

        // Update the corresponding productModel
        await updateProductModel(order._id, amount);

        return res.status(201).send({
            data: order,
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

router.put("/:id", async function(req, res, next) {
    try {
        let id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                message: "Invalid order ID",
                success: false,
                error: ["Id is not an ObjectId"]
            });
        }

        // Find the existing order before the update
        const existingOrder = await orderModel.findById(id);

        await orderModel.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: req.body }
        );

        let updatedOrder = await orderModel.findById(id);

        // Update the corresponding productModel
        await updateProductModel(id, updatedOrder.amount);

        return res.status(201).send({
            data: updatedOrder,
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

router.delete("/:id", async function(req, res, next) {
    try {
        let id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                message: "Invalid order ID",
                success: false,
                error: ["Id is not an ObjectId"]
            });
        }

        // Find the existing order before deletion
        const existingOrder = await orderModel.findById(id);

        await orderModel.deleteOne(
            { _id: new mongoose.Types.ObjectId(id) }
        );

        let orders = await orderModel.find();

        // Update the corresponding productModel after deletion
        await updateProductModel(id, 0);  // Assuming you want to set amount to 0 after deletion

        return res.status(200).send({
            data: orders,
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
});


module.exports = router;