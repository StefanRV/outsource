const sequelize = require('../config/db');
require('dotenv').config();
const { Product, User, Category, Chat, Message } = require('../models');


sequelize.sync({force:true}).then(async () => {
    console.log("База данных и таблицы созданы!");
    const admin = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        passwords: 'admin',
        role: 'admin',
        balance: '100',
        createdAt:sequelize.literal('CURRENT_TIMESTAMP')
    });
    const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwords: 'test',
        role: 'user',
        balance: '100',
        createdAt:sequelize.literal('CURRENT_TIMESTAMP')
    });
    const category1 = await Category.create({
        name: 'Figma',
        description: 'Figma category'
    });
    const category2 = await Category.create({
        name: '3D',
        description: '3D category'
    });
    console.log(admin.toJSON());
    const product = await Product.create({
        imageURL: '',
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        userId: 1,
        categoryId: 1,
    });
    console.log(product.toJSON());
    const product2 = await Product.create({
        imageURL: '',
        name: 'Test Product2',
        description: 'Test Description',
        price: 10.99,
        userId: 2,
        categoryId: 1,
    });
    const product3 = await Product.create({
        imageURL: '',
        name: 'Test Product3',
        description: 'Test Description',
        price: 10.99,
        userId: 1,
        categoryId: 2,
    });
    const chat = await Chat.create({
        userId: 1,
        user2Id: 2,
    });
    const message = await Message.create({
        content: 'Hello!',
        chatId: 1,
        senderId: 1,
        ifRead: true,
        createdAt:sequelize.literal('CURRENT_TIMESTAMP')
    });
    const message2 = await Message.create({
        content: 'Hello too!',
        chatId: 1,
        senderId: 2,
        ifRead: true,
        createdAt:sequelize.literal('CURRENT_TIMESTAMP')
    });
})