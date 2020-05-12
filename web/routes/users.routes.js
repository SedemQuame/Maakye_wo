// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const user = require('./../controllers/users.controller');

    //========================================== app users routes ============================================//
    app.route('/user_login')
        .get((req, res) => {
//             req.session.destroy(function(err) {
//   // cannot access session here
// })
            res.render(__dirname + './../views/login.views.ejs', {access_level: req.session.access_level, msg: ""});
        });

    app.route('/user_signup')
        .get((req, res) => {
            res.render(__dirname + './../views/signup.views.ejs', {access_level: req.session.access_level, msg: ""});
        });

    // signup route
    app.route('/signup').post(user.createUser);

    // login route
    app.route('/login').post(user.login);
};