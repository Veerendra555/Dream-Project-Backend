var express = require('express');
var router = express.Router();
var accountController = require('../controllers/account.Controllers');
const { protect } = require('../middleware/auth');
/* GET home page. */
router.post('/addAccountDetails', accountController.addAccountDetails);
router.get('/getAccountDetails', accountController.getAccountDetails);


module.exports = router;
