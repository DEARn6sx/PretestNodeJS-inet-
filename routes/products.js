var express = require("express")
var router = express.Router()
const productModel = require('../models/product'); // Adjust the path based on your project structure

router.post("/", async function(req, res, next) {
    try {
        const { id, product_name, price, amount } = req.body;
        let newProduct = new productModel({
            id: id,
            product_name: product_name,
            price: price,
            amount: amount,
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

        let product = await productModel.findById(id);

        if (!product) {
            return res.status(404).send({
                message: "Product not found",
                success: false,
            });
        }

        return res.status(200).send({
            data: product,
            message: "Success",
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






router.put("/", function(req, res, next) {
    res.send("Method Put")
})

router.delete("/", function(req, res, next) {
    res.send("Method Delete")
})

module.exports = router;