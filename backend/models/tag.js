const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32,
        unique: true
    }, 
    slug: {
        type: String,
        lowercase: true,
        index: true,
    }
}, {timeStamp: true});

module.exports = mongoose.model('Tag', tagSchema);