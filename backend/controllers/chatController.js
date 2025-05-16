const { Op } = require('sequelize');
const { jwtVerify } = require('jose');
const { Chat, Message, User } = require('../models');

exports.getUserChats = async (req, res) => {
  try {
    const userId = req.userId;
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [{ userId }, { user2Id: userId }],
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username'] }, // Use the correct alias 'user1'
        { model: User, as: 'user2', attributes: ['id', 'username'] }, // Use the correct alias 'user2'
        {
          model: Message,
          as: 'messages',
          attributes: ['createdAt'],
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    console.log('Raw chats data:', JSON.stringify(chats, null, 2)); // Add logging

    const formattedChats = chats.map(chat => {
      const isUserFirst = chat.userId === userId;
      const chatUser = isUserFirst ? chat.user2 : chat.user1; // Update to use 'user1' instead of 'user'
      const latestMessage = chat.messages && chat.messages.length > 0 ? chat.messages[0] : null;

      return {
        id: chat.id,
        userId: chat.userId,
        user2Id: chat.user2Id,
        chatUsername: chatUser ? chatUser.username : 'Unknown User', // Fallback if chatUser is null
        latestMessageTime: latestMessage ? latestMessage.createdAt : null,
        createdAt: chat.createdAt,
      };
    });

    console.log('Formatted chats:', JSON.stringify(formattedChats, null, 2)); // Add logging

    res.json(formattedChats);
  } catch (err) {
    console.error('Ошибка при получении чатов:', err);
    res.status(500).json({ error: 'Ошибка получения чатов' });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.findAll({
      where: { chatId },
      order: [['createdAt', 'ASC']],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения сообщений' });
  }
};

exports.startChat = async (req, res) => {
  const { userId, user2Id } = req.body;

  if (!userId || !user2Id) {
    return res.status(400).json({ error: 'User IDs required' });
  }

  try {
    let chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { userId, user2Id },
          { userId: user2Id, user2Id: userId },
        ],
      },
    });

    if (!chat) {
      chat = await Chat.create({ userId, user2Id });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка создания чата' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const { recipientId, content } = req.body;
    if (!recipientId || !content) {
      return res.status(400).json({ error: "Недостаточно данных" });
    }

    let chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { userId: senderId, user2Id: recipientId },
          { userId: recipientId, user2Id: senderId },
        ],
      },
    });

    if (!chat) {
      chat = await Chat.create({ userId: senderId, user2Id: recipientId });
    }

    const message = await Message.create({
      content,
      chatId: chat.id,
      senderId,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Ошибка при отправке сообщения:", err);
    res.status(500).json({ error: "Ошибка отправки сообщения" });
  }
};