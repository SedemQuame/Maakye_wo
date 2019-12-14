//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');


// ==================================== creating database schema=======================================//
const userSchema = mongoose.Schema({
    full_name: { type: String },
    password: { type: String },
    user_type: { type: String },
    phone_number: { type: String },
    email_address: { type: String },
    access_level: { type: String },
    location_data: { type: String },
    drivers_license: { type: String },
    license_number: [{ type: String }]
        // owned_vehicles: [ObjectId]
});

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('user', userSchema);