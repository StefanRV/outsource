const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name']
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [{ model: Product, as: 'products' }]
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = await Category.create({ name, description });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const [updated] = await Category.update(
      { name, description },
      { where: { id } }
    );
    if (updated) {
      const updatedCategory = await Category.findByPk(id);
      return res.status(200).json(updatedCategory);
    }
    return res.status(404).json({ error: 'Category not found' });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (deleted) {
      return res.status(200).json({ message: "Category deleted" });
    }
    return res.status(404).json({ error: 'Category not found' });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.assignProductToCategory = async (req, res) => {
  try {
    const { productId, categoryId } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    product.categoryId = categoryId;
    await product.save();

    res.status(200).json({ message: "Product assigned to category successfully" });
  } catch (error) {
    console.error("Error assigning product to category:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.removeProductFromCategory = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.categoryId = null;
    await product.save();

    res.status(200).json({ message: "Product removed from category successfully" });
  } catch (error) {
    console.error("Error removing product from category:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
