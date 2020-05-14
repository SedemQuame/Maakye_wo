// jshint esversion:6
//====================================== requiring modules ===========================================//
const video = require('../models/videos.models');
const vehicles = require('../models/vehicles.models');
const notifications = require('../models/notifications.models');


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
    vehicles.findOne({_id: req.body._id}).then( doc => {
        doc.administrative_actions.charge = "Charged";
        doc.save();
        // pushing user actions, to notification board.
        notifications.create(
            {
                user_id: "3",
                details: ``,
                date: ``,
            }, err => {
                console.log(`Error occurred, when adding user actions to notification collection`);
        });
        res.send({msg: "Field updated ... "});
        
    }).catch(err => {
        res.send({msg: "Update action unsuccessful."});
    });
};

exports.flagVehicle = (req, res) => {
    vehicles.findOne({_id: req.body._id}).then( doc => {
        doc.administrative_actions.flag_vehicle = "Charged";
        doc.save();
        res.send({msg: "Field updated ... "});
    }).catch(err => {
        res.send({msg: "Update action unsuccessful."});
    });
};

exports.licenseSuspension = (req, res) => {
    vehicles.findOne({_id: req.body._id}).then( doc => {
        doc.administrative_actions.license_suspension = "Charged";
        doc.save();
        res.send({msg: "Field updated ... "});
    }).catch(err => {
        res.send({msg: "Update action unsuccessful."});
    });
};