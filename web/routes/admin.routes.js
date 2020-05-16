// jshint esversion:6
// ================================ creating list application route ===================================//
module.exports = app => {
    const admin = require('../controllers/admin.controllers');

    //========================================== app dashboard routes ============================================//
    app.route('/admin')
        .get(admin.getNotifications);

    app.route('/modify_user')
        .get(admin.modifyUserAccountFromAdmin);
};