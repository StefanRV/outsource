const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authJwt = require("../middleware/authJose");

router.get('/',  categoryController.getCategories);
router.get('/:id',  categoryController.getCategoryById);
router.post('/', [authJwt.verifyToken], categoryController.createCategory);
router.put('/:id', [authJwt.verifyToken], categoryController.updateCategory);
router.delete('/:id', [authJwt.verifyToken], categoryController.deleteCategory);
router.post('/assign', [authJwt.verifyToken], categoryController.assignProductToCategory);
router.post('/remove', [authJwt.verifyToken], categoryController.removeProductFromCategory);

module.exports = router;