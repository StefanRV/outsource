const { Order, Product, User, Topic } = require('../models');
const sequelize = require('../config/db');

const getSummaryStats = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).json({ error: 'Access token is missing' });
    }

    // Fetch all data in parallel
    const [orders, products, users, topics] = await Promise.all([
      Order.findAll(),
      Product.findAll(),
      User.findAll(),
      Topic.findAll(),
    ]);

    const totalIncome = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice || 0), 0);

    const stats = {
      purchases: orders.length,
      products: products.length,
      users: users.length,
      forumTopics: topics.length,
      income: totalIncome,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSummaryStats };