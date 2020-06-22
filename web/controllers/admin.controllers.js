// jshint esversion:6
require('dotenv').config({ path: __dirname + './../.env' });
const notifications = require('../models/notifications.models');
const users = require('../models/users.models');


exports.getNotifications = (req, res) => {
    // getting the notification here.
    notifications.find({}).then(docs => {
        users.find({}).then(users => {

            if(docs == null){
                res.render(
                    __dirname + './../views/admin.views.ejs',
                    {access_level: req.session.access_level, msg: "", notifications : null, users: users}
                );
            }

            res.render(
                __dirname + './../views/admin.views.ejs',
                {access_level: req.session.access_level, msg: "", notifications : docs, users: users}
            );
        });
    }).catch(err => {
        res.render(
            __dirname + './../views/admin.views.ejs',
            {access_level: req.session.access_level, msg: "Couldn't retrieve notifications try again, later.", notifications : []}
        );
    });    
};

exports.modifyUserAccountFromAdmin = (req, res) => {
    // Create a findAndUpdate function here.
    // for modifying user access_levels.
    users.findByIdAndUpdate(req.query.user_to_modify, {access_level: req.query.current_acccess_level}).then(() => {
        res.redirect('/admin');
    }).catch(err => {
        console.log(`Error ocuured, whilst getting user information.`);
        res.send({err: err});
    });
};