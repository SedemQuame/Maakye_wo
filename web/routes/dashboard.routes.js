// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const dashboard = require('../controllers/dashboard.controllers');

    //========================================== app dashboard routes ============================================//
    app.route('/dashboard')
        .get((req, res) => {
            console.log(`User Access Level ${req.session.access_level}`);
            res.render(__dirname + './../views/dashboard.views.ejs', {access_level: req.session.access_level});
        });
};