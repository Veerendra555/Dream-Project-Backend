var express = require('express');
var router = express.Router();
var categorieController = require('../controllers/categorie.Controller');
const { protect } = require('../middleware/auth');
/* GET home page. */
router.post('/addCategorie', categorieController.addCategorie);
router.get('/getCategories', categorieController.getCategories);
router.get('/getCategoriesByDisplayStatus', categorieController.getCategoriesByDisplayStatus);
// router.get('/getMembersCount', memberController.getMembersCount);
router.get('/getCategorieById/:id', categorieController.getCategorieById);
router.put('/updateCategorie', categorieController.updateCategorie);
router.put('/changeCategorieStatus', categorieController.changeCategorieStatus);
// router.delete('/deleteMemberById/:id', memberController.deleteMemberById);

module.exports = router;
