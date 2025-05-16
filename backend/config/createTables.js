const sequelize = require("../config/db");
require("dotenv").config();
const { Product, User, Category, Chat, Message } = require("../models");

sequelize
  .sync({ force: true })
  .then(async () => {
    console.log("DB and tables created!");

    // Создание пользователей
    const admin = await User.create({
      username: "admin",
      email: "admin@example.com",
      passwords: "4-71K<oQ-OS}",
      role: "admin",
      balance: "100",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const creativeguy = await User.create({
      username: "creativeguy",
      email: "creativeguy@example.com",
      passwords: "test",
      role: "user",
      balance: "100",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const nadyakit = await User.create({
      username: "nadyakit",
      email: "nadyakit@example.com",
      passwords: "nadya123",
      role: "user",
      balance: "100",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });

    console.log(admin.toJSON());
    console.log(creativeguy.toJSON());
    console.log(nadyakit.toJSON());

    // Создание категорий
    const category1 = await Category.create({
      name: "Textures",
      description: "Textures category",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const category2 = await Category.create({
      name: "3D models",
      description: "3D models category",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const category3 = await Category.create({
      name: "Pattern",
      description: "Pattern category",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const category4 = await Category.create({
      name: "Mockups",
      description: "Mockups category",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const category5 = await Category.create({
      name: "Fonts",
      description: "Fonts category",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const category6 = await Category.create({
      name: "Illustrations",
      description: "Illustrations category",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const category7 = await Category.create({
      name: "Stock Photos",
      description: "Stock Photos category",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const category8 = await Category.create({
      name: "UI Kits",
      description: "UI Kits category",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const category9 = await Category.create({
      name: "Icons",
      description: "Icons category",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const category10 = await Category.create({
      name: "Letters",
      description: "Letter designs category",
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // Создание продуктов (25 уникальных)
    const product1 = await Product.create({
      imageUrl: "/uploads/android_kit.png",
      fileUrl: "/uploads/sample.zip", // Путь к ZIP-файлу
      name: "Android Kit",
      description: "Android UI kit design",
      price: 15.99,
      userId: admin.id,
      categoryId: category8.id, // UI Kits
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product2 = await Product.create({
      imageUrl: "/uploads/casette.png",
      fileUrl: "/uploads/sample.zip",
      name: "Cassette Tape PNG",
      description: "High-quality cassette tape texture",
      price: 2.0,
      userId: creativeguy.id,
      categoryId: category1.id, // Textures
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product3 = await Product.create({
      imageUrl: "/uploads/cave.png",
      fileUrl: "/uploads/sample.zip",
      name: "Cave 3D Model",
      description: "Detailed 3D cave environment",
      price: 34.99,
      userId: admin.id,
      categoryId: category2.id, // 3D models
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product4 = await Product.create({
      imageUrl: "/uploads/foodieapp.png",
      fileUrl: "/uploads/sample.zip",
      name: "Foodie App UI Kit",
      description: "UI kit for food delivery apps",
      price: 19.99,
      userId: creativeguy.id,
      categoryId: category8.id, // UI Kits
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product5 = await Product.create({
      imageUrl: "/uploads/icons.png",
      fileUrl: "/uploads/sample.zip",
      name: "Icons Pack",
      description: "Set of customizable icons",
      price: 8.0,
      userId: admin.id,
      categoryId: category9.id, // Icons
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product6 = await Product.create({
      imageUrl: "/uploads/instagram_kit.png",
      fileUrl: "/uploads/sample.zip",
      name: "Instagram UI Kit",
      description: "Instagram-inspired UI design",
      price: 12.99,
      userId: creativeguy.id,
      categoryId: category8.id, // UI Kits
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product7 = await Product.create({
      imageUrl: "/uploads/material_ui.png",
      fileUrl: "/uploads/sample.zip",
      name: "Material UI Kit",
      description: "Material design UI kit",
      price: 14.99,
      userId: admin.id,
      categoryId: category8.id, // UI Kits
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product8 = await Product.create({
      imageUrl: "/uploads/mockups.png",
      fileUrl: "/uploads/sample.zip",
      name: "Mockup Set",
      description: "Collection of device mockups",
      price: 10.99,
      userId: creativeguy.id,
      categoryId: category4.id, // Mockups
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product9 = await Product.create({
      imageUrl: "/uploads/pattern.png",
      fileUrl: "/uploads/sample.zip",
      name: "Seamless Pattern",
      description: "Seamless pattern design",
      price: 6.5,
      userId: admin.id,
      categoryId: category3.id, // Pattern
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product10 = await Product.create({
      imageUrl: "/uploads/santa.png",
      fileUrl: "/uploads/sample.zip",
      name: "Christmas Illustration",
      description: "Holiday-themed illustration",
      price: 11.0,
      userId: creativeguy.id,
      categoryId: category6.id, // Illustrations
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product11 = await Product.create({
      imageUrl: "/uploads/scrollbars.png",
      fileUrl: "/uploads/sample.zip",
      name: "Scrollbar Design",
      description: "Custom scrollbar illustrations",
      price: 7.99,
      userId: admin.id,
      categoryId: category6.id, // Illustrations
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product12 = await Product.create({
      imageUrl: "/uploads/smooth_icons.png",
      fileUrl: "/uploads/sample.zip",
      name: "Smooth Icons",
      description: "Smooth and modern icon set",
      price: 9.99,
      userId: creativeguy.id,
      categoryId: category9.id, // Icons
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product13 = await Product.create({
      imageUrl: "/uploads/sunnyday.png",
      fileUrl: "/uploads/sample.zip",
      name: "Font SunnyDay",
      description: "Stylish font for creative projects",
      price: 5.0,
      userId: nadyakit.id,
      categoryId: category5.id, // Fonts
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product14 = await Product.create({
      imageUrl: "/uploads/torn_paper.png",
      fileUrl: "/uploads/sample.zip",
      name: "Torn Paper Texture",
      description: "Unique torn paper texture",
      price: 3.99,
      userId: admin.id,
      categoryId: category1.id, // Textures
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product15 = await Product.create({
      imageUrl: "/uploads/wireframingkit.png",
      fileUrl: "/uploads/sample.zip",
      name: "Wireframing Kit",
      description: "Comprehensive wireframe kit",
      price: 15.99,
      userId: creativeguy.id,
      categoryId: category8.id, // UI Kits
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product16 = await Product.create({
      imageUrl: "/uploads/letter_a.png",
      fileUrl: "/uploads/sample.zip",
      name: "Letter A",
      description: "Letter A design",
      price: 1.99,
      userId: nadyakit.id,
      categoryId: category10.id, // Letters
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product17 = await Product.create({
      imageUrl: "/uploads/letter_b.png",
      fileUrl: "/uploads/sample.zip",
      name: "Letter B",
      description: "Letter B design",
      price: 1.99,
      userId: nadyakit.id,
      categoryId: category10.id, // Letters
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product18 = await Product.create({
      imageUrl: "/uploads/letter_c.png",
      fileUrl: "/uploads/sample.zip",
      name: "Letter C",
      description: "Letter C design",
      price: 1.99,
      userId: nadyakit.id,
      categoryId: category10.id, // Letters
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product19 = await Product.create({
      imageUrl: "/uploads/letter_e.png",
      fileUrl: "/uploads/sample.zip",
      name: "Letter E",
      description: "Letter E design",
      price: 1.99,
      userId: nadyakit.id,
      categoryId: category10.id, // Letters
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product20 = await Product.create({
      imageUrl: "/uploads/letter_h.png",
      fileUrl: "/uploads/sample.zip",
      name: "Letter H",
      description: "Letter H design",
      price: 1.99,
      userId: nadyakit.id,
      categoryId: category10.id, // Letters
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product21 = await Product.create({
      imageUrl: "/uploads/letter_k.png",
      fileUrl: "/uploads/sample.zip",
      name: "Letter K",
      description: "Letter K design",
      price: 1.99,
      userId: nadyakit.id,
      categoryId: category10.id, // Letters
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product22 = await Product.create({
      imageUrl: "/uploads/letter_m.png",
      fileUrl: "/uploads/sample.zip",
      name: "Letter M",
      description: "Letter M design",
      price: 1.99,
      userId: nadyakit.id,
      categoryId: category10.id, // Letters
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product23 = await Product.create({
      imageUrl: "/uploads/letter_o.png",
      fileUrl: "/uploads/sample.zip",
      name: "Letter O",
      description: "Letter O design",
      price: 1.99,
      userId: nadyakit.id,
      categoryId: category10.id, // Letters
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product24 = await Product.create({
      imageUrl: "/uploads/letter_p.png",
      fileUrl: "/uploads/sample.zip",
      name: "Letter P",
      description: "Letter P design",
      price: 1.99,
      userId: nadyakit.id,
      categoryId: category10.id, // Letters
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const product25 = await Product.create({
      imageUrl: "/uploads/letter_t.png",
      fileUrl: "/uploads/sample.zip",
      name: "Letter T",
      description: "Letter T design",
      price: 1.99,
      userId: nadyakit.id,
      categoryId: category10.id, // Letters
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // Создание чатов и сообщений
    const chat = await Chat.create({
      userId: admin.id,
      user2Id: creativeguy.id,
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const message = await Message.create({
      content: "Hello!",
      chatId: chat.id,
      senderId: admin.id,
      ifRead: true,
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });
    const message2 = await Message.create({
      content: "Hello too!",
      chatId: chat.id,
      senderId: creativeguy.id,
      ifRead: true,
      createdAt: sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });

    console.log("Test data created successfully!");
  })
  .catch((err) => {
    console.error("Error creating test data:", err);
  });
