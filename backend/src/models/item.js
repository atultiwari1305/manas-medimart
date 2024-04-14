const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    _id: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;