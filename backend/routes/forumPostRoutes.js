const express = require('express');
const router = express.Router();
const postController = require('../controllers/forumPostController');

router.get('/', postController.findByTopic);
router.post('/', postController.create);
router.post('/vote', postController.votePost);

module.exports = router;