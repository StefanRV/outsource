const { Op } = require('sequelize');
const Message = require('../models/message');
const User = require('../models/user');
const Chat = require('../models/chat');
const userController = require('../controllers/userController');
const { jwtVerify } = require('jose'); 

// exports.getChatHistory = async (req, res) => {
//   const { userId } = req.params;
//   const token = req.headers['x-access-token'];

//   if (!token) {
//     return res.status(401).json({ error: 'Access token is missing' });
//   }

//   try {
//     const secretKey = process.env.JWT_SECRET || 'your-secret-key';
//     const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
//     const currentUserId = payload.id;
   
//     const users = await User.findAll({
//       attributes: ['id'],
//     });
//     const validUserIds = users.map(user => user.id);


//     // const recipientId = parseInt(userId);
//     // if (isNaN(recipientId) || !validUserIds.includes(recipientId)) {
//     //   return res.status(400).json({ error: 'Invalid recipient ID' });
//     // }

//     const messages = await Message.findAll({
//       where: {
//         [Op.or]: [
//           { senderId: currentUserId, recipientId: recipientId },
//           { senderId: recipientId, recipientId: currentUserId },
//         ],
//       },
//       include: [
//         {
//           model: User,
//           as: 'sender',
//           attributes: ['id', 'username'],
//         },
//         {
//           model: User,
//           as: 'recipient',
//           attributes: ['id', 'username'],
//         },
//       ],
//       order: [['createdAt', 'ASC']],
//     });

//     res.status(200).json({ messages });
//   } catch (err) {
//     console.error('Error fetching chat history:', err);
//     res.status(500).json({ error: 'Failed to fetch chat history' });
//   }
// };

exports.sendMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  if (!content || !recipientId) {
    return res.status(400).json({ error: 'Content and recipientId are required' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
    const senderId = payload.id;

    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const message = await Message.create({
      senderId,
      recipientId,
      content,
      ifRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });


    const fullMessage = await Message.findOne({
      where: { id: message.id },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username'] },
        { model: User, as: 'recipient', attributes: ['id', 'username'] },
      ],
    });

    res.status(201).json({ message: fullMessage });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
// exports.getChatPartners = async (req, res) => {
//   const token = req.headers['x-access-token'];
//   if (!token) {
//     return res.status(401).json({ error: 'Access token is missing' });
//   }

//   try {
//     const secretKey = process.env.JWT_SECRET || 'your-secret-key';
//     const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
//     const currentUserId = parseInt(payload.id, 10);
//     if (isNaN(currentUserId)) {
//       return res.status(400).json({ error: 'Invalid user ID in token' });
//     }

//     const messages = await Message.findAll({
//       where: {
//         [Op.or]: [
//           { senderId: currentUserId },
//           { recipientId: currentUserId },
//         ],
//       },
//       attributes: ['senderId', 'recipientId'],
//       group: ['senderId', 'recipientId'],
//     });

//     const userIds = new Set();
//     messages.forEach((msg) => {
//       const senderId = parseInt(msg.senderId, 10);
//       const recipientId = parseInt(msg.recipientId, 10);
//       if (!isNaN(senderId) && senderId !== currentUserId) {
//         userIds.add(senderId);
//       }
//       if (!isNaN(recipientId) && recipientId !== currentUserId) {
//         userIds.add(recipientId);
//       }
//     });

//     if (userIds.size === 0) {
//       return res.status(200).json({ chatPartners: [] });
//     }

//     const chatPartners = await User.findAll({
//       where: { id: Array.from(userIds) },
//       attributes: ['id', 'username'],
//     });

//     res.status(200).json({ chatPartners });
//   } catch (err) {
//     console.error('Error fetching chat partners:', err);
//     res.status(500).json({ error: 'Failed to fetch chat partners' });
//   }
// };