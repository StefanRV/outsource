const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const chatController = require('../controllers/chatController');
const authJwt = require("../middleware/authJose");
const verifyRole = require('../middleware/verifyRole');

router.get('/chats', [authJwt.verifyToken], chatController.getUserChats);
router.get('/chats/:chatId/messages', [authJwt.verifyToken], chatController.getChatMessages);
router.post('/messages', [authJwt.verifyToken], chatController.sendMessage);
router.post('/chats/start', [authJwt.verifyToken], chatController.startChat);

// router.post('/chat', [authJwt.verifyToken], messageController.sendMessage);

module.exports = router;
