const mongoose = require('mongoose')

const products = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    product_name: { type: String },
    price: { type: Number },
    amount: { type: Number },
})
module.exports = mongoose.model('products', products)