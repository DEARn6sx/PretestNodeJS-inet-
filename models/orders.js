const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    product_id: { type: String },
    product_name: { type: String },
    amount: { type: Number },
    totalprice: { type: Number },
}, {
    timestamps: true
})


module.exports = mongoose.model('orders', orderSchema)