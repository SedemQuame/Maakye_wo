// jshint esversion: 6
/**Author: Sedem Quame Amekpewu
 * Date: Saturday, 14th December, 2019
 * Project Title: Maakye wo
 * Descripition: Maakye wo, is a survelliance system for monitoring road traffic adnd siphoning, relevant
 *               data for analytics purposes.
 **/

// ===================================== requiring modules ===================================== //
// node modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const fs = require('fs');
// custom modules
const db = require('./config/db.config');


// ================================== express app configurations ==================================== //
//creating app
const app = express();

// creating video routes
const router = express.Router();

// passing router to app
app.use(router);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// serving static files in express
app.use(express.static(__dirname));
app.use(express.static('public'));

// app.use(express.static('views'));

// adding sessions to express
app.use(session({
    secret: 'some_random_keyboard_String',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 600000}
}));

app.use(passport.initialize());


// ====================================== db configurations ========================================= //
mongoose.Promise = global.Promise;

const connectDB = async () => {
    await mongoose.connect(db.url, db.options);
    console.log('DB Connected....');
};

connectDB();

const assets = 'public/videos';
const videName = 'detection'; // without extension

{
// router.get('/', (req, res) => {
//     fs.access(assets+'/images/'+videName+'.jpg', fs.F_OK, (err) => {
        
//         if (err) {
//             exec(`bin/ffmpeg -i ${assets}/${videName}.mp4 -ss 00:00:04.00 -r 1 -an -vframes 1 -f mjpeg ${assets}/images/${videName}.jpg`, (error, stdout, stderr) => {
//                 if (error) {
//                     return;
//                 }
    
//                 res.render('index', {
//                     image: `/assets/images/${videName}.jpg`
//                 });
//             });
//         }

//         if(err === null) {
//             res.render('index', {
//                 image: `/assets/images/${videName}.jpg`
//             });
//         }
//     });
// });
}

// using route to stream videos.
router.get('/video', (req, res) => {

    // const path = `/video/detection.mp4`;
    const path = `${assets}/${videName}.mp4`;

    fs.stat(path, (err, stat) => {

        // Handle file not found
        if (err !== null && err.code === 'ENOENT') {
            res.sendStatus(404);
        }

        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {

            const parts = range.replace(/bytes=/, "").split("-");

            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
            
            const chunksize = (end-start)+1;
            const file = fs.createReadStream(path, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(200, head);
            fs.createReadStream(path).pipe(res);
        }
    });
});


//====================================== requiring list routes ========================================//
require('./routes/roads.routes')(app);
require('./routes/users.routes')(app);
require('./routes/videos.routes')(app);
require('./routes/violators.routers')(app);
require('./routes/dashboard.routes')(app);
require('./routes/admin.routes')(app);


// ========================================== app routes ============================================ //
app.get('/', (req, res) => {
    req.session.access_level = "0";
    
    // useful for postman testing
    // res.json({ "message": "Welcome to maakye wo application." });

    // useful for rendering views in browser
    res.redirect('/user_signup');
});

// ====================================== app listening port ======================================== //
let port = process.env.PORT||8080;
app.listen(port, function() {
    console.log(`app started on port: ${port}`);
    console.log(`Open app on http://localhost:8080/`);
});
