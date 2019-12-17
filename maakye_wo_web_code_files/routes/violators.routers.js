// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const vehicle = require('../controllers/violators.controllers');

    //========================================== app dashboard routes ============================================//
    app.route('/violators')
        .get((req, res) => {
            res.render(__dirname + './../views/violatoranalyser.views.ejs');
        });
};