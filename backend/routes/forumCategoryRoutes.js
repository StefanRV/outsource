const express = require('express');
const router = express.Router();
const forumCategoryController = require('../controllers/forumCategoryController');
const authJwt = require("../middleware/authJose");

router.get('/', forumCategoryController.findAll);
router.post('/', [authJwt.verifyToken], forumCategoryController.create);
router.delete('/:id', [authJwt.verifyToken], forumCategoryController.delete);

module.exports = router;