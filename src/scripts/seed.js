const { db, COLLECTIONS } = require('../config/firebase');

const sampleData = {
  categories: [
    {
      id: 'men',
      name: 'Men',
      subcategories: ['Jeans', 'T-Shirts', 'Polo Shirts', 'Jackets', 'Shorts'],
      filters: ['colors', 'sizes', 'material']
    },
    {
      id: 'women',
      name: 'Women',
      subcategories: ['Jeans', 'Jackets'],
      filters: ['colors', 'sizes', 'material']
    },
    {
      id: 'kids',
      name: 'Kids',
      subcategories: ['Jeans', 'T-Shirts', 'Polo Shirts', 'Jackets', 'Shorts'],
      filters: ['colors', 'sizes', 'material']
    }
  ],
  
  products: [
    // Men's Jeans
    {
      name: "Classic Denim Jeans",
      description: "High-quality denim jeans with classic fit. Perfect for everyday wear.",
      category: "Men",
      subcategory: "Jeans",
      price: 49.99,
      images: ["https://example.com/jeans-1.jpg", "https://example.com/jeans-2.jpg"],
      colors: ["Blue", "Black", "Gray"],
      sizes: ["28", "30", "32", "34", "36"],
      waist: ["28", "30", "32", "34", "36"],
      inseam: ["30", "32", "34"],
      fit: ["Slim", "Regular"],
      material: "Cotton Denim",
      stock: 50,
      rating: 4.5,
      createdAt: new Date().toISOString()
    },
    {
      name: "Slim Fit Jeans",
      description: "Modern slim fit jeans with stretch comfort.",
      category: "Men",
      subcategory: "Jeans",
      price: 59.99,
      images: ["https://example.com/slim-jeans-1.jpg"],
      colors: ["Blue", "Black"],
      sizes: ["30", "32", "34", "36"],
      waist: ["30", "32", "34", "36"],
      inseam: ["30", "32", "34"],
      fit: ["Slim"],
      material: "Stretch Denim",
      stock: 40,
      rating: 4.3,
      createdAt: new Date().toISOString()
    },
    
    // Men's T-Shirts
    {
      name: "Premium Cotton T-Shirt",
      description: "Soft, comfortable cotton t-shirt for everyday wear.",
      category: "Men",
      subcategory: "T-Shirts",
      price: 24.99,
      images: ["https://example.com/tshirt-1.jpg"],
      colors: ["White", "Black", "Navy", "Red", "Gray"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      material: "100% Cotton",
      stock: 100,
      rating: 4.7,
      createdAt: new Date().toISOString()
    },
    {
      name: "V-Neck T-Shirt",
      description: "Classic v-neck t-shirt with a modern fit.",
      category: "Men",
      subcategory: "T-Shirts",
      price: 29.99,
      images: ["https://example.com/vneck-tshirt-1.jpg"],
      colors: ["White", "Black", "Blue", "Green"],
      sizes: ["S", "M", "L", "XL"],
      material: "Cotton Blend",
      stock: 75,
      rating: 4.2,
      createdAt: new Date().toISOString()
    },
    
    // Men's Polo Shirts
    {
      name: "Classic Polo Shirt",
      description: "Timeless polo shirt with embroidered logo.",
      category: "Men",
      subcategory: "Polo Shirts",
      price: 39.99,
      images: ["https://example.com/polo-1.jpg"],
      colors: ["White", "Black", "Navy", "Red"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      material: "Pique Cotton",
      stock: 60,
      rating: 4.4,
      createdAt: new Date().toISOString()
    },
    
    // Men's Jackets
    {
      name: "Denim Jacket",
      description: "Classic denim jacket with a modern fit.",
      category: "Men",
      subcategory: "Jackets",
      price: 79.99,
      images: ["https://example.com/jacket-1.jpg"],
      colors: ["Blue", "Black"],
      sizes: ["S", "M", "L", "XL"],
      material: "Denim",
      stock: 30,
      rating: 4.6,
      createdAt: new Date().toISOString()
    },
    
    // Women's Jeans
    {
      name: "Women's Slim Jeans",
      description: "Stylish slim fit jeans for women.",
      category: "Women",
      subcategory: "Jeans",
      price: 54.99,
      images: ["https://example.com/womens-jeans-1.jpg"],
      colors: ["Blue", "Black", "White"],
      sizes: ["26", "28", "30", "32"],
      waist: ["26", "28", "30", "32"],
      inseam: ["28", "30", "32"],
      fit: ["Slim", "Skinny"],
      material: "Stretch Denim",
      stock: 45,
      rating: 4.8,
      createdAt: new Date().toISOString()
    },
    {
      name: "Women's Bootcut Jeans",
      description: "Classic bootcut jeans for a retro look.",
      category: "Women",
      subcategory: "Jeans",
      price: 59.99,
      images: ["https://example.com/womens-bootcut-1.jpg"],
      colors: ["Blue", "Black"],
      sizes: ["26", "28", "30", "32", "34"],
      waist: ["26", "28", "30", "32", "34"],
      inseam: ["30", "32", "34"],
      fit: ["Regular"],
      material: "Denim",
      stock: 35,
      rating: 4.4,
      createdAt: new Date().toISOString()
    },
    
    // Women's Jackets
    {
      name: "Women's Denim Jacket",
      description: "Stylish denim jacket for women.",
      category: "Women",
      subcategory: "Jackets",
      price: 89.99,
      images: ["https://example.com/womens-jacket-1.jpg"],
      colors: ["Blue", "Black", "White"],
      sizes: ["XS", "S", "M", "L", "XL"],
      material: "Denim",
      stock: 25,
      rating: 4.3,
      createdAt: new Date().toISOString()
    },
    
    // Kids' Clothing
    {
      name: "Kids' Denim Jeans",
      description: "Durable denim jeans for active kids.",
      category: "Kids",
      subcategory: "Jeans",
      price: 34.99,
      images: ["https://example.com/kids-jeans-1.jpg"],
      colors: ["Blue", "Black", "Gray"],
      sizes: ["XS", "S", "M", "L"],
      waist: ["22", "24", "26", "28"],
      inseam: ["20", "22", "24", "26"],
      fit: ["Regular"],
      material: "Cotton Denim",
      stock: 55,
      rating: 4.2,
      createdAt: new Date().toISOString()
    },
    {
      name: "Kids' T-Shirt",
      description: "Comfortable cotton t-shirt for kids.",
      category: "Kids",
      subcategory: "T-Shirts",
      price: 19.99,
      images: ["https://example.com/kids-tshirt-1.jpg"],
      colors: ["White", "Blue", "Red", "Green", "Yellow"],
      sizes: ["XS", "S", "M", "L"],
      material: "100% Cotton",
      stock: 80,
      rating: 4.5,
      createdAt: new Date().toISOString()
    },
    {
      name: "Kids' Polo Shirt",
      description: "Classic polo shirt for kids.",
      category: "Kids",
      subcategory: "Polo Shirts",
      price: 29.99,
      images: ["https://example.com/kids-polo-1.jpg"],
      colors: ["White", "Navy", "Red"],
      sizes: ["XS", "S", "M", "L"],
      material: "Pique Cotton",
      stock: 50,
      rating: 4.3,
      createdAt: new Date().toISOString()
    },
    {
      name: "Kids' Jacket",
      description: "Warm and stylish jacket for kids.",
      category: "Kids",
      subcategory: "Jackets",
      price: 59.99,
      images: ["https://example.com/kids-jacket-1.jpg"],
      colors: ["Blue", "Red", "Black"],
      sizes: ["XS", "S", "M", "L"],
      material: "Polyester Blend",
      stock: 30,
      rating: 4.1,
      createdAt: new Date().toISOString()
    },
    {
      name: "Kids' Shorts",
      description: "Comfortable shorts for active kids.",
      category: "Kids",
      subcategory: "Shorts",
      price: 24.99,
      images: ["https://example.com/kids-shorts-1.jpg"],
      colors: ["Blue", "Khaki", "Black"],
      sizes: ["XS", "S", "M", "L"],
      material: "Cotton Blend",
      stock: 60,
      rating: 4.4,
      createdAt: new Date().toISOString()
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');
    
    // Seed categories
    console.log('📁 Seeding categories...');
    for (const category of sampleData.categories) {
      await db.collection(COLLECTIONS.CATEGORIES).doc(category.id).set(category);
    }
    console.log('✅ Categories seeded successfully!');
    
    // Seed products
    console.log('👕 Seeding products...');
    for (const product of sampleData.products) {
      await db.collection(COLLECTIONS.PRODUCTS).add(product);
    }
    console.log('✅ Products seeded successfully!');
    
    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();