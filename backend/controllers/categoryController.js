const Category = require("../models/Category");
const slugify = require("slugify");

/*
====================================
CREATE CATEGORY (Admin)
====================================
*/

exports.createCategory = async (req, res) => {
  try {
    const { name, icon, isPopular } = req.body;

    const existing = await Category.findOne({ name });

    if (existing) {
      return res.status(400).json({
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name,
      slug: slugify(name, { lower: true }),
      icon,
      isPopular
    });

    res.status(201).json({
      success: true,
      data: category
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
GET ALL CATEGORIES (Public)
====================================
*/

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
GET POPULAR CATEGORIES
====================================
*/

exports.getPopularCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isPopular: true });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
GET CATEGORY BY SLUG
====================================
*/

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
UPDATE CATEGORY (Admin)
====================================
*/

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    category.name = req.body.name || category.name;
    category.slug = slugify(category.name, { lower: true });
    category.icon = req.body.icon ?? category.icon;
    category.isPopular = req.body.isPopular ?? category.isPopular;

    await category.save();

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
====================================
DELETE CATEGORY (Admin)
====================================
*/

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
