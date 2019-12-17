// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const user = require('./../controllers/users.controller');

    //========================================== app users routes ============================================//
    app.route('/user_login')
        .get((req, res) => {
            res.render(__dirname + './../views/login.views.ejs');
        });

    app.route('/user_signup')
        .get((req, res) => {
            res.render(__dirname + './../views/signup.views.ejs');
        });

    // signup route
    app.route('/signup').post(user.createUser);

    // login route
    app.route('/login').post(user.login);
};