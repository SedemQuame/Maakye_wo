//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');


// ==================================== creating database schema=======================================//
const notificationSchema = mongoose.Schema({
    user_type: { type: String },
    details: { type: String },
    date: { type: String },
    actionBy: { type: String }
});

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('notifications', notificationSchema);