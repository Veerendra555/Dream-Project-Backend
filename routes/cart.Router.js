var express = require('express');
var router = express.Router();
var cartController = require('../controllers/cart.Controller');
const { protect } = require('../middleware/auth');
/* GET home page. */
router.post('/addCart', cartController.addCart);
router.get('/getCarts', cartController.getCarts);
// router.get('/getMembersCount', memberController.getMembersCount);
router.get('/getCartByUserId/:user_id', cartController.getCartByUserId);
router.get('/getCartBySpecialStatus/:specialStatus', cartController.getCartBySpecialStatus);
// router.get('/getCartBrandById/:catId', cartController.getCartBrandById);
router.put('/updateCart', cartController.updateCart);
router.put('/updateQuntity', cartController.updateQuntity);
router.put('/changeCartStatus', cartController.changeCartStatus);
router.delete('/deleteCartProductByUserId', cartController.deleteCartProductByUserId);

module.exports = router; 





