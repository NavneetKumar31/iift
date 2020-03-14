const mongoose = require('mongoose');

// Product Schema
var ProductSchema = mongoose.Schema({
    name: {
        type: String,
        index: {
            unique: true
        }
    },
    brand: {
        type: String,
    },
    buyingPrice: {
        type: Number
    },
    sellingPrice: {
        type: Number
    },
    quantity: {
        type: Number
    },
    addedOn: {
        type: Date
    },
    addedBy: {
        type: String
    }
});

module.exports = mongoose.model('Product', ProductSchema);