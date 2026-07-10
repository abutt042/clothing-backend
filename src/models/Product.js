const { db, COLLECTIONS } = require('../config/firebase');

class ProductModel {
  // Get all products with filters
  static async getAll(filters = {}) {
    let query = db.collection(COLLECTIONS.PRODUCTS);
    
    // Apply filters
    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }
    
    if (filters.subcategory) {
      query = query.where('subcategory', '==', filters.subcategory);
    }
    
    if (filters.minPrice) {
      query = query.where('price', '>=', parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      query = query.where('price', '<=', parseFloat(filters.maxPrice));
    }
    
    if (filters.color) {
      query = query.where('colors', 'array-contains', filters.color);
    }
    
    if (filters.size) {
      query = query.where('sizes', 'array-contains', filters.size);
    }
    
    if (filters.material) {
      query = query.where('material', '==', filters.material);
    }
    
    // Execute query
    const snapshot = await query.get();
    let products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Apply additional filters that can't be done with Firestore queries
    if (filters.fit) {
      products = products.filter(p => p.fit && p.fit.includes(filters.fit));
    }
    
    if (filters.waist) {
      products = products.filter(p => p.waist && p.waist.includes(filters.waist));
    }
    
    if (filters.inseam) {
      products = products.filter(p => p.inseam && p.inseam.includes(filters.inseam));
    }
    
    // Apply search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.subcategory.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort
    if (filters.sortBy) {
      switch(filters.sortBy) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }
    
    return products;
  }

  // Get product by ID
  static async getById(id) {
    const doc = await db.collection(COLLECTIONS.PRODUCTS).doc(id).get();
    if (!doc.exists) {
      throw new Error('Product not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  // Get all categories
  static async getCategories() {
    const snapshot = await db.collection(COLLECTIONS.CATEGORIES).get();
    const categories = [];
    snapshot.forEach(doc => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return categories;
  }

  // Get products by category
  static async getByCategory(category, filters = {}) {
    return this.getAll({ ...filters, category });
  }

  // Get all subcategories for a category
  static async getSubcategories(category) {
    const products = await this.getAll({ category });
    const subcategories = [...new Set(products.map(p => p.subcategory))];
    return subcategories;
  }

  // Get filter options for a category
  static async getFilterOptions(category) {
    const products = await this.getAll({ category });
    
    const options = {
      colors: [],
      sizes: [],
      materials: [],
      fits: [],
      waist: [],
      inseam: [],
      priceRange: { min: Infinity, max: -Infinity }
    };
    
    products.forEach(product => {
      // Colors
      if (product.colors) {
        product.colors.forEach(color => {
          if (!options.colors.includes(color)) {
            options.colors.push(color);
          }
        });
      }
      
      // Sizes
      if (product.sizes) {
        product.sizes.forEach(size => {
          if (!options.sizes.includes(size)) {
            options.sizes.push(size);
          }
        });
      }
      
      // Materials
      if (product.material && !options.materials.includes(product.material)) {
        options.materials.push(product.material);
      }
      
      // Fit (for jeans)
      if (product.fit) {
        product.fit.forEach(fit => {
          if (!options.fits.includes(fit)) {
            options.fits.push(fit);
          }
        });
      }
      
      // Waist (for jeans)
      if (product.waist) {
        product.waist.forEach(w => {
          if (!options.waist.includes(w)) {
            options.waist.push(w);
          }
        });
      }
      
      // Inseam (for jeans)
      if (product.inseam) {
        product.inseam.forEach(i => {
          if (!options.inseam.includes(i)) {
            options.inseam.push(i);
          }
        });
      }
      
      // Price range
      if (product.price < options.priceRange.min) {
        options.priceRange.min = product.price;
      }
      if (product.price > options.priceRange.max) {
        options.priceRange.max = product.price;
      }
    });
    
    // Sort options
    options.colors.sort();
    options.sizes.sort();
    options.materials.sort();
    options.fits.sort();
    options.waist.sort((a, b) => parseInt(a) - parseInt(b));
    options.inseam.sort((a, b) => parseInt(a) - parseInt(b));
    
    return options;
  }

  // Create new product
  static async create(productData) {
    const docRef = await db.collection(COLLECTIONS.PRODUCTS).add({
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  // Update product
  static async update(id, productData) {
    await db.collection(COLLECTIONS.PRODUCTS).doc(id).update({
      ...productData,
      updatedAt: new Date().toISOString()
    });
    return this.getById(id);
  }

  // Delete product
  static async delete(id) {
    await db.collection(COLLECTIONS.PRODUCTS).doc(id).delete();
    return { id, deleted: true };
  }
}

module.exports = ProductModel;