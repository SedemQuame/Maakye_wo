// jshint esversion:6
//====================================== requiring modules ===========================================//
const video = require('../models/videos.models');
const vehicles = require('../models/vehicles.models');
const road = require(`../models/roads.models`);

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
    // getting page's number.
    let pageNumber = parseInt(req.query.pageNumber);
    let pageSize = parseInt(req.query.pageSize);
    let query = {};
    // handling event where pageNumber is lesser than or equal to 0.
    if(pageNumber < 0 || pageNumber == 0){
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response);
    }
    query.skip = pageSize * (pageNumber - 1);
    query.limit = pageSize;
    // getting all videos in the database.
    vehicles.find({}, {}, query).then(docs => {
        console.log(`Vehicle Data: ${docs}`);

        video.find({_id: docs[0].video_id}).then(video => {
            // console.log(`Video Doc: ${video}`);

            road.findOne({camera_id: video[0].camera_id}).then(road => {
                // console.log(`Road Name: ${road}`);
                
                res.render(__dirname + './../views/violatorlists.views.ejs', {
                    violators: docs,
                    pageNumber: pageNumber,
                    access_level: req.session.access_level,
                    video: video,
                    road_name: road.street_name,
                    road_id: road._id
                });
            }).catch(err => {
                console.log('Error occurred whilst returning all videos from the database.');
                res.send({msg: `Error occurred ${err}`});
            });
        }).catch(err => {
            console.log('Error occurred whilst returning all videos from the database.');
            res.send({msg: `Error occurred ${err}`});
        });
    }).catch(err => {
        console.log('Error occurred whilst returning all videos from the database.');
        res.send({msg: `Error occurred ${err}`});
    });
};