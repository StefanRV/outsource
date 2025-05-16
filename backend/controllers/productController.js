const { Op } = require("sequelize");
const Product = require("../models/product");
const Category = require("../models/Category");
const User = require("../models/User");
const { jwtVerify } = require("jose");

exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, dateFilter, sort, page = 1, limit = 9 } = req.query;

    const where = {};

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.price = {
        [Op.gte]: minPrice ? parseFloat(minPrice) : 0,
        [Op.lte]: maxPrice ? parseFloat(maxPrice) : 100,
      };
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

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

    const offset = (page - 1) * limit;

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
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
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
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Error fetching products by category", error: error.message });
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
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id;

    const { name, description, price, categoryId } = req.body;
    if (!req.files || !req.files.image || !req.files.file) {
      return res.status(400).json({ message: 'Both image and zip/rar file are required' });
    }

    const imageUrl = `/uploads/${req.files.image[0].filename}`;
    const fileUrl = `/Uploads/${req.files.file[0].filename}`;

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
      userId,
      imageUrl,
      fileUrl,
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
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.imageUrl;
    let fileUrl = product.fileUrl;

    if (req.files) {
      if (req.files.image) {
        imageUrl = `/Uploads/${req.files.image[0].filename}`;
      }
      if (req.files.file) {
        fileUrl = `/Uploads/${req.files.file[0].filename}`;
      }
    }

    product.imageUrl = imageUrl;
    product.fileUrl = fileUrl;
    product.name = name;
    product.description = description;
    product.price = parseFloat(price);
    if (categoryId) {
      product.categoryId = parseInt(categoryId);
    }
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};