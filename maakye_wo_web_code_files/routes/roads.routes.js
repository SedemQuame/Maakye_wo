// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const road = require('./../controllers/roads.controllers');

    //========================================== app dashboard routes ============================================//
    app.route('/roads')
        .get((req, res) => {
            res.render(__dirname + './../views/roadanalyser.views.ejs');
    });

    app.route('/road_list').get(road.getAllRoads);
};