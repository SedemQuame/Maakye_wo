// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const home = require('../controllers/dashboard.controllers');

    //========================================== app dashboard routes ============================================//
    app.route('/dashboard')
        .get((req, res) => {
            res.render(__dirname + './../public/views/dashboard.views.ejs');
        });
};