// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const user = require('./../controllers/users.controller');

    //========================================== app users routes ============================================//
    app.route('/users')
        .get((req, res) => {
            res.render(__dirname + './../views/login_signup.views.ejs');
        });

    // signup route
    app.route('/signup').post(user.createUser);

    // login route
    app.route('/login').post(user.login);
};