const mongoose = require('mongoose');

// Define the schema for User details
const userDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    erp: {
        type: String,
        required: true
    },
    teamId: {
        type: String,
        required: true
    },
    teamName: {
        type: String,
        required: true
    },
    contactDetails: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    }
});

// Create and export the UserDetails model
module.exports = mongoose.model('UserDetails', userDetailsSchema);