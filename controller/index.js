const userController = require('../controller/userController');
const authController = require('../controller/authController');
const displayController = require('../controller/displayController');
const itemController = require('../controller/itemController');

module.exports = {
    userCtrl: userController,
    displayCtrl: displayController,
    itemCtrl: itemController,
    authCtrl: authController
};