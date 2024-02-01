var express = require('express');
var router = express.Router();
var memberController = require('../controllers/members.Controller');
const { protect } = require('../middleware/auth');
/* GET home page. */
router.post('/addMember', memberController.addMember);
router.post('/memberLogin', memberController.memberLogin);
router.get('/getMembers', memberController.getMembers);
router.get('/getMembersCount', memberController.getMembersCount);
router.get('/getMemberById/:id',  memberController.getMemberById);
router.put('/updateMember',memberController.updateMember);
router.put('/changeStatus',memberController.changeStatus);
router.delete('/deleteMemberById/:id', memberController.deleteMemberById);

module.exports = router;
