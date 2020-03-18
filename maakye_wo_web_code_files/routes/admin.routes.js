// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    // const admin = require('../controllers/admin.controllers');

    //========================================== app dashboard routes ============================================//
    app.route('/admin')
        .get((req, res) => {
            res.render(__dirname + './../views/admin.views.ejs');
        });
};