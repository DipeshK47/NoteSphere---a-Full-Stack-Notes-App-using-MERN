const mongoose = require("mongoose")
const Schema = mongoose.Schema
const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    isPinned: {
        type: String,
        default: false
    },
    createdOn: {
        type: Date,
        default: new Date().getTime()
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming the user schema is named 'User'
        required: true
    }
})

module.exports = mongoose.model("Note", noteSchema)