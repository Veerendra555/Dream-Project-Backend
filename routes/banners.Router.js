var express = require('express');
var router = express.Router();
var banner_Controller = require('../controllers/banners.Controller');
var { protect } = require('../middleware/auth');
 //Get Customer

router.post('/addBanner', banner_Controller.addBanner);
router.get('/getBanners',  banner_Controller.getBanners);
router.put('/bannerStatusChange', banner_Controller.bannerStatusChange);
router.delete('/deleteBannerById/:id', banner_Controller.deleteBannerById);

module.exports = router;
