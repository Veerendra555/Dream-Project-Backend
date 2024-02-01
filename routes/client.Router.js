var express = require('express');
var router = express.Router();
var clientController = require('../controllers/client.Controllers');
/* GET home page. */
router.post('/register', clientController.clientReg);
router.get('/getClient', clientController.getClients);
router.get('/getClientsById/:id', clientController.getClientsById);
// router.put('/updateUser', clientController.updateUser);
// router.put('/updateClienttatus', clientController.changeStatus);
// router.delete('/deleteUserById/:id', clientController.deleteUserById);

module.exports = router;
