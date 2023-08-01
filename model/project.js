const mongoose = require('mongoose');
const user = require('./user');
const schema = mongoose.Schema;

const projectSchema = new schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        type: schema.Types.ObjectId,
        ref: user,
        required: true
    }],
    description: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false
    },
    owner: {
        type: schema.Types.ObjectId,
        ref: user,
        required: true
    }
})

module.exports = mongoose.model('project', projectSchema)