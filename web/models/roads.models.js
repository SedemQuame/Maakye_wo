//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');


// ==================================== creating database schema=======================================//
const roadSchema = mongoose.Schema({
    street_name: { type: String },
    speed_range: { type: String },
    road_score: { type: String },
    road_type: { type: String },
    daily_temp: { type: String },
    daily_humidity: { type: String },
    avg_vehicle_count: { type: String },
    number_of_accidents: { type: String },
    camera_id: { type: String }
});

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('road', roadSchema);