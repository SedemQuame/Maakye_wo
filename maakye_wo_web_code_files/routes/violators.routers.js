// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const vehicle = require('../controllers/videos.controller');
    const violators = require('../controllers/violators.controllers');

    //========================================== app dashboard routes ============================================//
    app.route('/violators')
        .get((req, res) => {
            res.render(__dirname + './../views/violatoranalyser.views.ejs');
    });

    app.route('/violators/:videoId')
        .get(violators.getViolatorRecords);

    app.route('/violator_list').get(vehicle.getAllPossileViolators);

};