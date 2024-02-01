var express = require('express');
var router = express.Router();
var brandController = require('../controllers/brand.Controller');
const { protect } = require('../middleware/auth');
/* GET home page. */
router.post('/addBrand', brandController.addBrand);
router.get('/getBrands', brandController.getBrands);
// router.get('/getMembersCount', memberController.getMembersCount);
router.get('/getBrandById/:id', brandController.getBrandById);
router.get('/getCategorieById/:catId', brandController.getCategorieById);
router.put('/updateBrand', brandController.updateBrand);
router.put('/changeBrandStatus', brandController.changeBrandStatus);
// router.delete('/deleteMemberById/:id', memberController.deleteMemberById);

module.exports = router;





