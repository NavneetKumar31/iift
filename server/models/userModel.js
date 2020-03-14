const mongoose = require('mongoose');

// User Schema
var UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    mobile: {
        type: Number,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    password: {
        type: String
    },
    dob: {
        type: Date
    },
    role: {
        type: String
    },
    gender: {
        type: String
    },
    registeredOn: {
        type: Date
    },
    fatherHusbandName: {
        type: String
    },
    caste: {
        type: String
    },
    maritialStatus: {
        type: String
    },
    highestEducation: {
        type: String
    },
    fees: {
        type: Number
    },
    addedBy: {
        type: String
    },
    address: {
        type: Object
    }
});

module.exports = mongoose.model('User', UserSchema);