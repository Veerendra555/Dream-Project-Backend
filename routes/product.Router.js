var express = require('express');
var router = express.Router();
var productController = require('../controllers/product.Controller');
const { protect } = require('../middleware/auth');
/* GET home page. */
router.post('/addProduct', productController.addProduct);
router.get('/getProducts', productController.getProducts);
// router.get('/getMembersCount', memberController.getMembersCount);
router.get('/getProductByBrandId/:brandId', productController.getProductByBrandId);
router.get('/getProductByCategoryId/:catId', productController.getProductByCategoryId);
router.get('/getProductBySpecialStatus/:specialStatus', productController.getProductBySpecialStatus);
router.get('/getProductById/:productId', productController.getProductById);
router.put('/updateProduct', productController.updateProduct);
router.put('/changeProductStatus', productController.changeProductStatus);
// router.delete('/deleteMemberById/:id', memberController.deleteMemberById);

module.exports = router;





