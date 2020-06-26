// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const road = require('./../controllers/roads.controllers');

    //========================================== app dashboard routes ============================================//
    app.route('/roads/:roadId').get(road.getRoad);

    app.route('/road_list').get(road.getAllRoads);
};