var express = require('express');
var router = express.Router();
var eventController = require('../controllers/event.Controller');
/* GET home page. */
router.post('/register', eventController.addEvent);
router.get('/getEventsByClientId/:id', eventController.getEventsByClientId);

// router.get('/getBrands', brandController.getBrands);
// // router.get('/getMembersCount', memberController.getMembersCount);
// router.get('/getBrandById/:id', brandController.getBrandById);
// router.put('/updateBrand', brandController.updateBrand);
// router.put('/changeBrandStatus', brandController.changeBrandStatus);
// router.delete('/deleteMemberById/:id', memberController.deleteMemberById);

module.exports = router;





