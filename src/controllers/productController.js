const Product = require('../models/Product');

// Validation helper function
const validateProductData = (data, isUpdate = false) => {
  const errors = [];
  const validFields = [
    'name', 'description', 'category', 'subcategory', 'price', 
    'images', 'colors', 'sizes', 'material', 'stock', 'rating',
    'waist', 'inseam', 'fit', 'createdAt', 'updatedAt'
  ];

  // Check for extra fields (only for create)
  if (!isUpdate) {
    const extraFields = Object.keys(data).filter(field => !validFields.includes(field));
    if (extraFields.length > 0) {
      errors.push(`Invalid fields: ${extraFields.join(', ')}`);
    }
  }

  // Name validation
  if (!isUpdate || (isUpdate && data.name !== undefined)) {
    if (!data.name || data.name.trim() === '') {
      errors.push('Product name is required');
    } else if (data.name.length < 3) {
      errors.push('Product name must be at least 3 characters');
    } else if (data.name.length > 100) {
      errors.push('Product name must be less than 100 characters');
    }
  }

  // Description validation
  if (!isUpdate || (isUpdate && data.description !== undefined)) {
    if (!data.description || data.description.trim() === '') {
      errors.push('Product description is required');
    } else if (data.description.length < 10) {
      errors.push('Product description must be at least 10 characters');
    }
  }

  // Price validation
  if (!isUpdate || (isUpdate && data.price !== undefined)) {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      errors.push('Price must be a valid positive number');
    } else if (price > 10000) {
      errors.push('Price cannot exceed $10,000');
    }
  }

  // Category validation
  if (!isUpdate || (isUpdate && data.category !== undefined)) {
    const validCategories = ['Men', 'Women', 'Kids'];
    if (!data.category || !validCategories.includes(data.category)) {
      errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }
  }

  // Subcategory validation based on category
  if (!isUpdate || (isUpdate && data.subcategory !== undefined)) {
    const subcategoryMap = {
      'Men': ['Jeans', 'T-Shirts', 'Polo Shirts', 'Jackets', 'Shorts'],
      'Women': ['Jeans', 'Jackets'],
      'Kids': ['Jeans', 'T-Shirts', 'Polo Shirts', 'Jackets', 'Shorts']
    };
    
    if (data.category && data.subcategory) {
      const validSubcategories = subcategoryMap[data.category] || [];
      if (!validSubcategories.includes(data.subcategory)) {
        errors.push(`Subcategory "${data.subcategory}" is not valid for category "${data.category}"`);
      }
    } else if (data.subcategory && !data.category) {
      errors.push('Category is required when specifying subcategory');
    }
  }

  // Colors validation
  if (!isUpdate || (isUpdate && data.colors !== undefined)) {
    if (data.colors) {
      if (!Array.isArray(data.colors)) {
        errors.push('Colors must be an array');
      } else if (data.colors.length === 0) {
        errors.push('At least one color is required');
      } else if (data.colors.length > 10) {
        errors.push('Maximum 10 colors allowed');
      }
    } else if (!isUpdate) {
      errors.push('Colors are required');
    }
  }

  // Sizes validation
  if (!isUpdate || (isUpdate && data.sizes !== undefined)) {
    if (data.sizes) {
      if (!Array.isArray(data.sizes)) {
        errors.push('Sizes must be an array');
      } else if (data.sizes.length === 0) {
        errors.push('At least one size is required');
      }
    } else if (!isUpdate) {
      errors.push('Sizes are required');
    }
  }

  // Stock validation
  if (!isUpdate || (isUpdate && data.stock !== undefined)) {
    const stock = parseInt(data.stock);
    if (isNaN(stock) || stock < 0) {
      errors.push('Stock must be a valid non-negative number');
    } else if (stock > 10000) {
      errors.push('Stock cannot exceed 10,000');
    }
  }

  // Images validation
  if (!isUpdate || (isUpdate && data.images !== undefined)) {
    if (data.images) {
      if (!Array.isArray(data.images)) {
        errors.push('Images must be an array');
      } else if (data.images.length > 10) {
        errors.push('Maximum 10 images allowed');
      } else if (data.images.some(img => typeof img !== 'string' || !img.trim())) {
        errors.push('Invalid image URL format');
      }
    }
  }

  // Material validation
  if (!isUpdate || (isUpdate && data.material !== undefined)) {
    if (data.material && data.material.trim() === '') {
      errors.push('Material cannot be empty');
    }
  }

  // Rating validation
  if (!isUpdate || (isUpdate && data.rating !== undefined)) {
    if (data.rating !== undefined && data.rating !== null) {
      const rating = parseFloat(data.rating);
      if (!isNaN(rating) && (rating < 0 || rating > 5)) {
        errors.push('Rating must be between 0 and 5');
      }
    }
  }

  // Waist validation (for jeans)
  if (!isUpdate || (isUpdate && data.waist !== undefined)) {
    if (data.waist && data.subcategory === 'Jeans') {
      if (!Array.isArray(data.waist)) {
        errors.push('Waist sizes must be an array');
      } else if (data.waist.some(w => parseInt(w) <= 0)) {
        errors.push('Invalid waist size');
      }
    }
  }

  // Inseam validation (for jeans)
  if (!isUpdate || (isUpdate && data.inseam !== undefined)) {
    if (data.inseam && data.subcategory === 'Jeans') {
      if (!Array.isArray(data.inseam)) {
        errors.push('Inseam sizes must be an array');
      } else if (data.inseam.some(i => parseInt(i) <= 0)) {
        errors.push('Invalid inseam size');
      }
    }
  }

  // Fit validation (for jeans)
  if (!isUpdate || (isUpdate && data.fit !== undefined)) {
    if (data.fit) {
      const validFits = ['Slim', 'Regular', 'Relaxed', 'Skinny', 'Bootcut'];
      if (!Array.isArray(data.fit)) {
        errors.push('Fit must be an array');
      } else if (data.fit.some(f => !validFits.includes(f))) {
        errors.push(`Fit must be one of: ${validFits.join(', ')}`);
      }
    }
  }

  return errors;
};

// Sanitize product data
const sanitizeProductData = (data) => {
  const sanitized = {};
  const allowedFields = [
    'name', 'description', 'category', 'subcategory', 'price', 
    'images', 'colors', 'sizes', 'material', 'stock', 'rating',
    'waist', 'inseam', 'fit'
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined && data[field] !== null) {
      // Trim string fields
      if (typeof data[field] === 'string') {
        sanitized[field] = data[field].trim();
      } else if (Array.isArray(data[field])) {
        // Filter out empty strings from arrays
        sanitized[field] = data[field]
          .filter(item => item !== null && item !== undefined && item !== '')
          .map(item => typeof item === 'string' ? item.trim() : item);
      } else {
        sanitized[field] = data[field];
      }
    }
  }

  // Ensure required fields have defaults if not provided
  if (!sanitized.stock && sanitized.stock !== 0) {
    sanitized.stock = 0;
  }
  if (!sanitized.rating) {
    sanitized.rating = 0;
  }

  return sanitized;
};

// Get all products with filters
exports.getAllProducts = async (req, res) => {
  try {
    const filters = req.query;
    const products = await Product.getAll(filters);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Get categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get subcategories for a category
exports.getSubcategories = async (req, res) => {
  try {
    const { category } = req.params;
    const subcategories = await Product.getSubcategories(category);
    res.status(200).json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get filter options for a category
exports.getFilterOptions = async (req, res) => {
  try {
    const { category } = req.params;
    const options = await Product.getFilterOptions(category);
    res.status(200).json({
      success: true,
      data: options
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const rawData = req.body;
    
    // Validate the data
    const validationErrors = validateProductData(rawData, false);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Sanitize the data
    const sanitizedData = sanitizeProductData(rawData);
    
    // Create the product
    const product = await Product.create(sanitizedData);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const rawData = req.body;
    
    // Validate the data
    const validationErrors = validateProductData(rawData, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Sanitize the data
    const sanitizedData = sanitizeProductData(rawData);
    
    // Update the product
    const product = await Product.update(id, sanitizedData);
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Product not found'
    });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.delete(id);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};