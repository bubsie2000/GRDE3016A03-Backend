// Dependencies —————————————————————————————————
const mongoose = require('mongoose')

// Schema ————————————————————————————————————————
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true,
        default: false
    },
    assignment: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    doDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
}, {timestamps: true})

// Create model based on schema ———————————————————
const taskModel = mongoose.model('Task', taskSchema)

// Export model module —————————————————————————————
module.exports = taskModel