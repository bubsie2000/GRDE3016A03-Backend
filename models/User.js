// Dependencies ———————————————————————————————————
const mongoose = require('mongoose')
const Utils = require('./../utils')
require('mongoose-type-email')

// User schema ————————————————————————————————————
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    newUser: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

// Encrypt password field on save ——————————————————
userSchema.pre('save', function(next) {
    // check if password is present and is modified
    if(this.password && this.isModified() ){
        this.password = Utils.hashPassword(this.password);
    }
    next()
})

// Create user model based on schema ————————————————
const userModel = mongoose.model('User', userSchema)

// Export user model —————————————————————————————————
module.exports = userModel