const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const authJwt = require("../middleware/authJose");
const { upload } = require('../utils/multerConfig');

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/by-category", productController.getProductByCategory);
router.post('/', upload, productController.createProduct);
router.put('/:id', upload, productController.updateProduct);
router.delete("/:id", [authJwt.verifyToken], productController.deleteProduct);

module.exports = router;