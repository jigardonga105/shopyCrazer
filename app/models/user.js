const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' },
    image: [{ img: { type: String, required: true } }]
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)