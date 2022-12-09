// Dependencies —————————————————————————————————
const mongoose = require('mongoose');

// Schema ————————————————————————————————————————
const assignmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    weighting: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    mark: {
        type: mongoose.Types.Decimal128
    },
    dueDate: {
        type: Date,
        required: true
    },
    class: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

// Create model based on schema ———————————————————
const assignmentModel = mongoose.model('Assignment', assignmentSchema)

// Export model module —————————————————————————————
module.exports = assignmentModel