const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    approved: { type: Boolean, default: false },
}, {
    timestamps: true
});

// Ensure an index on the 'username' field
userSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model('users', userSchema);