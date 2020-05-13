// jshint esversion:6
//====================================== requiring modules ===========================================//
const video = require('../models/videos.models');
const vehicles = require('../models/vehicles.models');



//================================== creating HTTP handler methods ==================================//

// getting video data and passing to the violator viewer page.
exports.getViolatorRecords = (req, res) => {
    video.find({_id: req.params.videoId}).then(videoDocs => {
        // Getting the vehicles information.
        vehicles.find({video_id: req.params.videoId}).then(vehicleDocs => {
            res.render(
                __dirname + './../views/violatoranalyser.views.ejs',
                {
                    videoData: videoDocs, 
                    vehicleData: vehicleDocs, 
                    access_level: req.session.access_level
                }
            );
        }).catch();
    }).catch();
};


exports.issueCharge = (req, res) => {
    vehicles.findOne({_id: req.params._id}).then( doc => {
        console.log(doc);
        doc.administrative_actions.charge_back = "Charged";
        docs.save();
        res.send({msg: "muh'fucker"});
    }).catch(err => {
        console.log(`Error occurred: ${err}`);
        res.send({msg: "action unsuccessful."});
    });
};

// exports.flagVehicle = (req, res) => {
//     vehicles.find({_id: req.params._id}).then( doc => {
//         doc.administrative_actions.flag_vehicle = "Charged";
//         docs.save();
//         res.send({msg: "muh'fucker"});
//     }).catch();
// };

// exports.licenseSuspension = (req, res) => {
//     vehicles.find({_id: req.params._id}).then( doc => {
//         doc.administrative_actions.license_suspension = "Charged";
//         docs.save();
//         res.send({msg: "muh'fucker"});
//     }).catch();
// };