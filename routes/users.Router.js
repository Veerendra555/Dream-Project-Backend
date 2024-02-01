var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users.Controllers');
const { protect } = require('../middleware/auth');
/* GET home page. */
router.post('/addUser', usersController.addUser);
router.post('/userLogin', usersController.userLogin);
router.post('/userReg', usersController.userReg);
router.post('/sendOtp', usersController.sendOtp);
router.post('/reSendOtp', usersController.reSendOtp);
router.post('/verifyOtp', usersController.verifyOtp);
router.get('/getUsers', usersController.getUsers);
router.get('/getUserById/:id', usersController.getUserById);
router.put('/updateUser', usersController.updateUser);
router.put('/updateUserStatus', usersController.changeStatus);
// router.put('/changePassword/:id', usersController.changePassword);
router.delete('/deleteUserById/:id', usersController.deleteUserById);

module.exports = router;
