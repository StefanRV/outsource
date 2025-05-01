const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const authJwt = require("../middleware/authJose");

router.get('/',  topicController.findAllWithFilters);
router.get('/:id', topicController.getTopicById);
router.post('/', [authJwt.verifyToken], topicController.createTopic);

module.exports = router;