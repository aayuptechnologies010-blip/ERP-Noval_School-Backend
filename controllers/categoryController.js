const Category = require('../models/categoryModel');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const { name, isDefault } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const categoryExists = await Category.findOne({ name: name.toUpperCase() });

    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // If setting this as default, unset other defaults (Optional logic depending on requirements, but let's just create it)
    if (isDefault) {
      await Category.updateMany({}, { isDefault: false });
    }

    const category = await Category.create({
      name,
      isDefault: isDefault || false
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const { name, isDefault, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name && name.toUpperCase() !== category.name) {
      const categoryExists = await Category.findOne({ name: name.toUpperCase() });
      if (categoryExists) {
        return res.status(400).json({ message: 'Category name already in use' });
      }
    }

    // If updating this to be default, unset other defaults
    if (isDefault === true && !category.isDefault) {
      await Category.updateMany({}, { isDefault: false });
    }

    if (name) category.name = name;
    if (isDefault !== undefined) category.isDefault = isDefault;
    if (isActive !== undefined) category.isActive = isActive;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();
    res.status(200).json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};
