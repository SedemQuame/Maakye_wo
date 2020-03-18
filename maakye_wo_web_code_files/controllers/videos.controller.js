// jshint esversion:6
//====================================== requiring modules ===========================================//
const video = require('../models/videos.models');
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

exports.getAllPossileViolators = (req, res) => {
    // getting all videos in the database.
    vehicles.find({}).then(docs => {
        console.log(docs);
        res.render(__dirname + './../views/violatorlists.views.ejs', {violators: docs});
    }).catch(err => {
        console.log('Error occurred whilst returning all videos from the database.');
        res.send({msg: `Error occurred ${err}`});
    });
};