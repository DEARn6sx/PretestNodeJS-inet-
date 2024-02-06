const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    paassword: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
}, {
    timestamps: true
})


module.exports = mongoose.model('users', userSchema)