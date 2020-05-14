// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const vehicle = require('../controllers/videos.controller');
    const violators = require('../controllers/violators.controllers');

    //========================================== app dashboard routes ============================================//
    app.route('/violators')
        .get((req, res) => {
            res.render(
                __dirname + './../views/violatoranalyser.views.ejs', 
                {
                    access_level: req.session.access_level
                }
            );
    });

    app.route('/violators/:videoId')
        .get(violators.getViolatorRecords);

    app.route('/violator_list').get(vehicle.getAllPossileViolators);

    // administrative actions
    app.route('/issue_charge').post(violators.issueCharge);

    app.route('/vehicle_flagging').post(violators.flagVehicle);

    app.route('/license_suspension').post(violators.licenseSuspension);
};