const { User, Product, Order, OrderItem } = require('../models');
const sequelize = require('../config/db');
const { jwtVerify } = require('jose');

exports.createOrder = async (req, res) => {
  const { products } = req.body;

  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  let userId;
  try {
    const secretKey = process.env.JWT_SECRET || "your-secret-key";
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));

    if (!payload || !payload.id) {
      return res.status(400).json({ error: 'Invalid token: user ID not found' });
    }

    userId = payload.id;
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Product list is empty.' });
  }

  try {
 
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findByPk(userId, { transaction: t });
      if (!user) {
        throw new Error('User not found');
      }

      const productIds = products.map(p => p.productId);
      const foundProducts = await Product.findAll({
        where: { id: productIds },
        transaction: t,
      });

      if (foundProducts.length !== productIds.length) {
        throw new Error('Some products not found');
      }

      let totalPrice = 0;
      const orderItemsData = [];

      for (const { productId, quantity } of products) {
        const product = foundProducts.find(p => p.id === productId);
        const price = parseFloat(product.price);
        const quantity = 1;
        const subtotal = price * quantity;

        orderItemsData.push({
          productId,
          quantity,
          price,
        });

        totalPrice += subtotal;
      }

      if (user.balance < totalPrice) {
        throw new Error('Insufficient balance');
      }

      const order = await Order.create({
        userId,
        totalPrice,
      }, { transaction: t });

      for (const item of orderItemsData) {
        await OrderItem.create({
          orderId: order.id,
          ...item,
        }, { transaction: t });
      }

      user.balance -= totalPrice;
      await user.save({ transaction: t });

      return order;
    });

    res.status(201).json({ success: true, orderId: result.id });

  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.getUserOrders = async (req, res) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || "your-secret-key";
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
    const userId = payload.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [{
        model: OrderItem,
        include: [{ model: Product }],
      }],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, orders });

  } catch (err) {
    console.error('Failed to get user orders:', err);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

exports.getAllOrders = async (req, res) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || "your-secret-key";
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));

    if (!payload?.role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [{ model: Product }],
        },
        { model: User, as:'buyer', attributes: ['id', 'username', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, orders });

  } catch (err) {
    console.error('Failed to get all orders:', err);
    res.status(500).json({ error: 'Failed to retrieve all orders' });
  }
};

