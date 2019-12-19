// jshint esversion:6
require('dotenv').config({ path: __dirname + './../.env' });

//====================================== requiring modules ===========================================//
// node modules
// const bcrypt = require('bcrypt');
const passport = require('passport');


// custom models
const user = require('../models/users.models');

// use static authenticate method of model in LocalStrategy
passport.use(user.createStrategy());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

const SALT_ROUNDS = 12;

//================================== creating HTTP handler methods ==================================//
// create new user
exports.createUser = (req, res) => {
    bcrypt.hash(req.body.password, SALT_ROUNDS, function(err, hash) {
        // Store hash in your password DB.
        user.create({
            full_name: req.body.full_name,
            password: hash,
            user_type: 'normal',
            phone_number: req.body.phone_number,
            email_address: req.body.email_address,
            access_level: undefined,
            location_data: undefined,
            drivers_license: req.body.drivers_license
        }).then(() => {
            console.log('spinning user account ... 🥱🥱🥱');
            console.log('user account created ... 😎😎😎');
            console.log('redirecting user .../');
            res.redirect('/dashboard');
        }).catch((err) => {
            console.log('spinning user account ... 🥱🥱🥱');
            console.log('user not created ... 😪🙄😣');
            console.log('redirecting user .../');
            res.redirect('/user_signup');
        });
    });
};

// read user data
exports.retrieveUserData = (req, res) => {
    user.findById(req.body.userId).then().catch();
};

// update user data
exports.updateUserData = (req, res) => {
    user.findByIdAndUpdate(req.body.userId).then().catch();
};

// delete user by id
exports.deleteUserData = (req, res) => {
    user.findByIdAndDelete(req.body.userId).then().catch();
};

// user authentication and logging
exports.login = (req, res) => {
    // nothing at the moment.
    user_to_login = user.where({ email_address: req.body.email_address });
    user_to_login.findOne().then((returnedUser) => {
        // Load hash from your password DB.
        bcrypt.compare(req.body.password, returnedUser.password).then(function(response) {
            if (response == true) {
                console.log('redirecting user .../');
                console.log('account found ... 😎😎😎');
                res.redirect('/dashboard');
            } else {
                console.log('account not found ... 🥱🥱🥱');
                console.log('redirecting user .../');
                res.redirect('/user_login');
            }
        });
    }).catch((err) => {
        console.log('sorry, a serious error occurred ... 😪🙄😣');
        console.log('redirecting user .../');
        console.log(err);
        res.redirect('/user_login');
    });
};