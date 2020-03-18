//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');


// ==================================== creating database schema=======================================//
const vehicleSchema = mongoose.Schema({
    license: { type: String },
    vin_number: { type: String },
    color: { type: String },
    model: { type: String },
    speed: {type: String},
    video_id: { type: String },
});

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('vehicle', vehicleSchema);