// jshint esversion:6
require('dotenv').config({ path: __dirname + './../.env' });
const notifications = require('../models/notifications.models');

exports.getNotifications = (req, res) => {
    // getting the notification here.
    notifications.find({}).then(docs => {
        // console.log(docs);
        res.render(
            __dirname + './../views/admin.views.ejs',
            {access_level: req.session.access_level, msg: "", notifications : docs}
        );
    }).catch(err => {
        res.render(
            __dirname + './../views/admin.views.ejs',
            {access_level: req.session.access_level, msg: "Couldn't retrieve notifications try again, later.", notifications : []}
        );
    });

    
};