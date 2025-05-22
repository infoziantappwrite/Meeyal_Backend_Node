// controllers/subCategoryController.js
const SubCategory = require('../models/SubCategory');

exports.getAllSubCategoriesWithCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category'); // populate the `category` field

    res.status(200).json({
      success: true,
      data: subCategories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories with categories',
      error: err.message,
    });
  }
};
