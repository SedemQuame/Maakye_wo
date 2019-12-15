// jshint esversion:6
//====================================== requiring modules ===========================================//
const user = require('../models/users.models');


//================================== creating HTTP handler methods ==================================//

// create new user
exports.createUser = (req, res) => {

    user.create({
        full_name: req.body.full_name,
        password: req.body.password,
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
        res.redirect('/users');
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
    user_to_login = user.where({ email: req.body.email });
    user_to_login.findOne().then((returnedUser) => {
        if (returnedUser.password == req.body.password && returnedUser.email_address == req.body.email_address) {
            console.log('redirecting user .../');
            console.log('account found ... 😎😎😎');

            // authenticate user here.

            res.redirect('/dashboard');
        } else {
            console.log('account not found ... 🥱🥱🥱');
            console.log('redirecting user .../');
            res.redirect('/users');
        }
    }).catch((err) => {
        console.log('spinning user account ... 🥱🥱🥱');
        console.log('user not created ... 😪🙄😣');
        console.log('redirecting user .../');
        res.redirect('/users');
    });
};