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

// Delete order endpoint
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const order = await orderModel.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update product order quantity (subtracting order.amount)
        await deleteProductOrder(order.product_name, order.amount);

        // Delete the order
        await orderModel.findByIdAndDelete(id);

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Function to update product order quantity
async function deleteProductOrder(productName, amount) {
    try {
        const product = await productModel.findOne({ product_name: productName });

        if (!product) {
            console.error('Product not found');
            return;
        }

        // Subtract order.amount from product.order
        product.order -= amount;

        // Save the updated product
        await product.save();
    } catch (error) {
        console.error(error);
    }
}

// Update order endpoint
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { amount: newAmount } = req.body;

        if (!newAmount || isNaN(newAmount)) {
            return res.status(400).json({ message: 'Invalid amount provided' });
        }

        const order = await orderModel.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const oldAmount = order.amount;
        const product = await productModel.findOne({ product_name: order.product_name });

        // Update product order quantity
        product.order = product.order - oldAmount + newAmount;

        // Check if the new product order quantity exceeds the available amount
        if (product.order < 0 || product.order > product.amount) {
            return res.status(400).json({ message: 'New order quantity exceeds available amount' });
        }

        // Update the order amount and total price
        order.amount = newAmount;
        order.totalprice = newAmount * product.price;

        // Save the updated product and order
        await product.save();
        await order.save();

        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;