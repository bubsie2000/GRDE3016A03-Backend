// Dependencies —————————————————————————————————
const mongoose = require('mongoose')

// Schema ————————————————————————————————————————
const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    timeSlots: [
        {
            day: {
                type: String,
                required: true
            },
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ],
    studyPeriod: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    colour: {
        type: String
    }
}, {timestamps: true})

// Create model based on schema ———————————————————
const classModel = mongoose.model('Class', classSchema)

// Export model module —————————————————————————————
module.exports = classModel