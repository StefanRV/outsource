const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authJwt = require("../middleware/authJose");

router.get('/stats', [authJwt.verifyToken], dashboardController.getSummaryStats);

module.exports = router;