//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');

const administrativeActions = mongoose.Schema({
    charge: { type: String },
    flag_vehicle:  { type: String },
    license_suspension:  { type: String },
});

const registeredDriverInfo = mongoose.Schema({
    driver_name: { type: String },
    nationality: { type: String },
    driver_score: { type: String },
    number_of_violations: { type: String },
});

// ==================================== creating database schema=======================================//
const vehicleSchema = mongoose.Schema({
    license: { type: String },
    date_created: { type: String },
    color: { type: String },
    speed: {type: String},
    video_id: { type: String },
    administrative_actions: administrativeActions,
    registered_driver_info: registeredDriverInfo,
});

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('vehicle', vehicleSchema);