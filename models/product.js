const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    product_name: { type: String },
    price: { type: Number },
    amount: { type: Number },
    img: { type: String },
    order: {type: Number , default: 0},
}, {
    timestamps: true
})


module.exports = mongoose.model('products', productSchema)