// jshint esversion:6
//====================================== requiring modules ===========================================//
const video = require('../models/videos.models');
const vehicles = require('../models/vehicles.models');
const notifications = require('../models/notifications.models');
const road = require(`../models/roads.models`);

// ==================================node modules ===================================================//
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');


//================================== creating HTTP handler methods ==================================//

// getting video data and passing to the violator viewer page.
exports.getViolatorRecords = (req, res) => {
    video.find({_id: req.params.videoId}).then(videoDocs => {
        let image_path = videoDocs[0].asset_url;
        // Getting the vehicles information.
        vehicles.find({video_id: req.params.videoId}).then(vehicleDocs => {

            let pos = vehicleDocs[0].license.lastIndexOf("plate");
            let subStrLength = pos + 4 + 'plate'.length;

            let plate = vehicleDocs[0].license.slice(subStrLength, subStrLength + 7);
            console.log(`Plate Number: ${plate}`);

            road.findOne({camera_id: videoDocs[0].camera_id}).then(road => {
                res.render(
                    __dirname + './../views/violatoranalyser.views.ejs',
                    {
                        videoData: videoDocs, 
                        vehicleData: vehicleDocs, 
                        license: plate.toUpperCase(),
                        access_level: req.session.access_level,
                        road_id: road._id
                    }
                );
            }).catch();
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