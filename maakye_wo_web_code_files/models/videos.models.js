//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');


// ==================================== creating database schema=======================================//
const videoSchema = mongoose.Schema({
    file_name: { type: String },
    video_url: { type: String },
    duration: { type: String },
    date_create: { type: String },
    time_created: { type: String }
});

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('video', videoSchema);