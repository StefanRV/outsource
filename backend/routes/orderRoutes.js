const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController');
const authJwt = require("../middleware/authJose");
const verifyRole = require('../middleware/verifyRole');

router.post('/', [authJwt.verifyToken], createOrder);
router.get('/all', [verifyRole],  getAllOrders);
router.get('/user', getUserOrders);

module.exports = router;
