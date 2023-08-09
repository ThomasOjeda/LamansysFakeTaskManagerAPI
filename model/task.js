const mongoose = require('mongoose');
const story = require('./story');
const schema = mongoose.Schema;

const taskSchema = new schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    story: {
        type: schema.Types.ObjectId,
        ref: story,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
        required: false
    },
    due: {
        type: Date,
        required: false
    },
    done: {
        type: Boolean,
        required: false,
        default: false
    }
})

module.exports = mongoose.model('task', taskSchema)