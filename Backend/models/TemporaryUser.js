const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TemporaryUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationToken: { type: String, required: true },
    role: { type: String, default: 'user' }, // Preserve role if needed
    createdAt: { type: Date, default: Date.now, expires: 900 } // Expires in 15 minutes (900 seconds)
});

TemporaryUserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('TemporaryUser', TemporaryUserSchema);
