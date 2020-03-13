// jshint esversion:6
//====================================== requiring modules ===========================================//
const video = require('../models/videos.models');
const roads = require('../models/roads.models');
const vehicles = require('../models/vehicles.models');


//================================== creating HTTP handler methods ==================================//
// getting video data from db
exports.getVideo = (req, res) => {
    const videoId = req.params.videoId;

    // find video using it's id as a unique identifier.
    video.findById(videoId)
        .then(returnedVideo => {
            if (!returnedVideo) {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving video."
                });
            }
            res.send(returnedVideo);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Video item not found."
                });
            }
            return res.status(500).send({
                message: "Error retrieving video."
            });
        });
};

exports.getAllVideos = (req, res) => {
    // getting all videos in the database.
    video.find({}).then(docs => {
        // console.log(`Video docs: ${docs}`);

        docs.forEach(video => {           
            vehicles.find({video_id: video._id}).then(vehicleDoc => {               
                roads.find({video_id: video._id}).then(roadDoc => {
                // getting id for video and using it to package data.
                let violators = [];
                for (let i = 0; i < video.length; i++) {
                    let newObj = {};
                    newObj.video = video;
                    newObj.roadDoc = roadDoc;
                    newObj.vehicleDoc = vehicleDoc;

                    console.log(newObj);
                    violators.push(newObj);
                }
                res.send({docs: violators});
                }).catch(err => {
                    res.send({msg: `Error occurred ${err}`});
                });
            }).catch(err => {
                res.send({msg: `Error occurred ${err}`});
            });
        });

        // console.log(violators);
        

    }).catch(err => {
        console.log('Error occurred whilst returning all videos from the database.');
        res.send({msg: `Error occurred ${err}`});
    });
};