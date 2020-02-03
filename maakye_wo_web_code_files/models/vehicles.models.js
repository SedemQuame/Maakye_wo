//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');


// ==================================== creating database schema=======================================//
const vehicleSchema = mongoose.Schema({
    license_number: { type: String },
    vin_number: { type: String },
    vehicle_color: { type: String },
    vehicle_type: { type: String },
    driver_id: { type: String },
});

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('vehicle', vehicleSchema);