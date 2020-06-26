// jshint esversion:6
//====================================== requiring modules ===========================================//
const road = require('../models/roads.models');
// Load the full build.
const _ = require('lodash');


//================================== creating HTTP handler methods ==================================//
exports.getAllRoads = (req, res) => {
    // getting all videos in the database.
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
    road.find({}, {}, query).then(docs => {
        docs = _.uniqBy(docs, function (e) {
            return e.camera_id;
        });
        // console.log(docs);
        // // docs.save();
        res.render(__dirname + './../views/roadlists.views.ejs', {roads: docs, pageNumber: pageNumber, access_level: req.session.access_level});
    }).catch(err => {
        console.log('Error occurred whilst returning all videos from the database.');
        res.send({msg: `Error occurred ${err}`});
    });
};

exports.getRoad = (req, res) => {    
    road.findById({_id: req.params.roadId}).then(road => {
        res.render(__dirname + './../views/roadanalyser.views.ejs', {
            road_data: road,
            access_level: req.session.access_level,
        });
    }).catch(err => {
        console.log('Error occurred whilst returning all videos from the database.');
        res.send({msg: `Error occurred ${err}`});
    });
}