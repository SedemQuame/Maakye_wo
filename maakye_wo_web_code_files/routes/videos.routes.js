// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const video = require('./../controllers/videos.controller');

    //========================================== app dashboard routes ============================================//
    app.route('/getAllViolators').get(video.getAllPossileViolators);
};