const mongoose = require('mongoose');
const project = require('./project');
const schema = mongoose.Schema;

const sprintSchema = new schema({
    id: {
        type: Number,
        required: true,
        min: 1,
        unique: true,
        dropDups: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    start: {
        type: Date,
        required: true,
        default: Date.now
    },
    finish: {
        type: Date,
        required: true,
        default: () => { return new Date(Date.now() + (1000 * 60 * 60 * 24 * 15)) }
    },
    project: {
        type: schema.Types.ObjectId,
        ref: project,
        required: true
    },
})

module.exports = mongoose.model('sprint', sprintSchema)