// jshint esversion:6
require('dotenv').config({ path: __dirname + './../.env' });

//====================================== requiring modules ===========================================//
// node modules
const bcrypt = require('bcrypt');
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

    console.log(req.body);
    
    bcrypt.hash(req.body.password, SALT_ROUNDS, function(err, hash) {
        // Store hash in your password DB.
        user.create({
            full_name: req.body.full_name,
            password: hash,
            phone_number: req.body.phone_number,
            email_address: req.body.email_address,
            access_level: req.body.access_level,
            drivers_license: req.body.drivers_license,
        }).then(() => {
            console.log('spinning user account ... 🥱🥱🥱');
            console.log('user account created ... 😎😎😎');
            console.log('redirecting user .../');
            // if(req.session.access_level){
            //     console.log("session about to be destroyed");
                
            //     req.session.destroy(function(err) {
            //         // cannot access session here
            //         console.log("cannot access session");
            //         console.log(err);
            //     });
            //     console.log("session destroyed");
            // }else{
                req.session.access_level = "1";
            // }
            res.redirect('/dashboard');
        }).catch((err) => {
            console.log('spinning user account ... 🥱🥱🥱');
            console.log('user not created ... 😪🙄😣');
            console.log('redirecting user .../');
            console.log(err);
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
                console.log(returnedUser);

                // saving returned user details in sessions
                // req.session._id = returnedUser._id;
                req.session.access_level = returnedUser.access_level;
                console.log(returnedUser.access_level);
                
                
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