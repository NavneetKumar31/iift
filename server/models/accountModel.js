const mongoose = require('mongoose');

var selledProducts = new mongoose.Schema({
    name: {
        type: String
    },
    quantity: {
        type: Number
    },
    unit_price: {
        type: Number
    },
    total_price: {
        type: Number
    },
    date_of_sell: {
        type: Date
    },
    description: {
        type: String
    }
});

var addedMember = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    fees: {
        type: Number
    },
    date_of_added: {
        type: Date
    }
});

// spend by member
var spendByMember = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    type: {
        type: String
    },
    amount: {
        type: Number
    },
    date_of_spend: {
        type: Date
    }
});

// Account Schema
var AccountSchema = mongoose.Schema({
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    name: {
        type: String,
    },
    total_earn_amount: {
        type: Number,
    },
    total_spend_amount: {
        type: Number,
    },
    selledProducts: [selledProducts],
    addedMembers: [addedMember],
    spends: [spendByMember],
    modifiedOn: {
        type: Date
    }
});

module.exports = mongoose.model('Account', AccountSchema);