const { Op } = require("sequelize");
const Product = require("../models/product");
const Category = require("../models/Category");
const User = require("../models/User");
const { jwtVerify } = require("jose");

exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, dateFilter, sort, page = 1, limit = 9 } = req.query;

    const where = {};

    // Category filter
    if (category) {
      where.categoryId = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {
        [Op.gte]: minPrice ? parseFloat(minPrice) : 0,
        [Op.lte]: maxPrice ? parseFloat(maxPrice) : 100,
      };
    }

    // Search filter (name or description)
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // Date filter
    if (dateFilter) {
      const now = new Date();
      let fromDate;

      if (dateFilter === 'day') {
        fromDate = new Date(now.setDate(now.getDate() - 1));
      } else if (dateFilter === 'week') {
        fromDate = new Date(now.setDate(now.getDate() - 7));
      } else if (dateFilter === 'year') {
        fromDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }

      where.createdAt = { [Op.gte]: fromDate };
    }

    // Pagination
    const offset = (page - 1) * limit;

    // Fetch products with pagination
    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['createdAt', sort === 'asc' ? 'ASC' : 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      products,
      totalPages,
      currentPage: parseInt(page),
      totalItems: total,
    });
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    res.status(500).json({ message: 'Ошибка при получении продуктов', error: error.message });
  }
};

exports.getProductByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    let condition = {};

    if (category) {
      condition.categoryId = category;
    }

    const products = await Product.findAll({
      where: condition,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Ошибка при получении продуктов по категории:", error);
    res
      .status(500)
      .json({ message: "Ошибка при получении продуктов по категории", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "seller",
          attributes: ["id", "username", "email"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "Продукт не найден" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении продукта", error });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const secret = new TextEncoder().encode(process.env.secret);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id;

    const { name, description, price, categoryId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const product = await Product.create({
      name,
      description,
      price,
      categoryId,
      userId,
      imageUrl,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Продукт не найден" });
    }

    let imageUrl = product.imageUrl;
    if (req.file) {
      imageUrl = `/Uploads/${req.file.filename}`;
    }

    product.imageUrl = imageUrl;
    product.name = name;
    product.description = description;
    product.price = parseFloat(price);
    if (categoryId) {
      product.categoryId = parseInt(categoryId);
    }
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
    res.status(500).json({ message: "Ошибка при обновлении продукта", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Продукт не найден" });
    }
    await product.destroy();
    res.status(200).json({ message: "Продукт успешно удалён" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении продукта", error });
  }
};