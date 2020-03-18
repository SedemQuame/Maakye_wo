// jshint esversion:6
//====================================== requiring modules ===========================================//
const road = require('../models/roads.models');


//================================== creating HTTP handler methods ==================================//
exports.getAllRoads = (req, res) => {
    // getting all videos in the database.
    road.find({}).then(docs => {
        // console.log(`Video docs: ${docs}`);
        // docs.forEach(video => {           
        //     vehicles.find({video_id: video._id}).then(vehicleDoc => {               
        //         roads.find({video_id: video._id}).then(roadDoc => {
        //         // getting id for video and using it to package data.
        //         let violators = [];
        //         for (let i = 0; i < video.length; i++) {
        //             let newObj = {};
        //             newObj.video = video;
        //             newObj.roadDoc = roadDoc;
        //             newObj.vehicleDoc = vehicleDoc;
        //             console.log(newObj);
        //             violators.push(newObj);
        //         }
        //         res.send({docs: violators});
        //         }).catch(err => {
        //             res.send({msg: `Error occurred ${err}`});
        //         });
        //     }).catch(err => {
        //         res.send({msg: `Error occurred ${err}`});
        //     });
        // });
        console.log(docs);
        res.render(__dirname + './../views/roadlists.views.ejs', {roads: docs});
    }).catch(err => {
        console.log('Error occurred whilst returning all videos from the database.');
        res.send({msg: `Error occurred ${err}`});
    });
};