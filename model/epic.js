const mongoose = require('mongoose');
const project = require('./project');
const schema = mongoose.Schema;

const epicSchema = new schema({
    project: {
        type: schema.Types.ObjectId,
        ref: project,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('epic', epicSchema)