const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    order_name: { type: String },
    amount: { type: Number },
    totalprice: { type: Number },
}, {
    timestamps: true
})


module.exports = mongoose.model('orders', orderSchema)