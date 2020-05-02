//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


// ==================================== creating database schema=======================================//
const userSchema = new mongoose.Schema({
    full_name: { type: String },
    password: { type: String },
    phone_number: { type: String },
    email_address: { type: String },
    access_level: { type: String},
    drivers_license: { type: String },
});

userSchema.plugin(passportLocalMongoose);

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('user', userSchema);