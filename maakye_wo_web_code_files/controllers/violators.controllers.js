// jshint esversion:6
//====================================== requiring modules ===========================================//
const vehicle = require('../models/vehicles.models');
const video = require('../models/videos.models');


//================================== creating HTTP handler methods ==================================//

// getting video data and passing to the violator viewer page.
exports.getViolatorRecords = (req, res) => {
    video.find({_id: req.params.videoId}).then(docs => {
        console.log(docs);
        res.render(__dirname + './../views/violatoranalyser.views.ejs', {videoData: docs});
    }).catch();

};