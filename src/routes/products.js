const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getCategories,
  getSubcategories,
  getFilterOptions,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:category/subcategories', getSubcategories);
router.get('/:category/filters', getFilterOptions);
router.get('/:id', getProductById);

// Admin routes (add authentication middleware in production)
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;