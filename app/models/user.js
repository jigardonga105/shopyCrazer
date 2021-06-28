const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' },
    gender: { type: String },
    image: [{ img: { type: String, required: true } }]
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)