const API_BASE_URL = 'http://localhost:5000/api';

// Test functions
async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');
    
    // 1. Get all products
    console.log('1️⃣ Getting all products...');
    const allProducts = await fetch(`${API_BASE_URL}/products`).then(r => r.json());
    console.log(`   Found ${allProducts.count} products\n`);
    
    // 2. Get products by category
    console.log('2️⃣ Getting men\'s products...');
    const menProducts = await fetch(`${API_BASE_URL}/products?category=Men`).then(r => r.json());
    console.log(`   Found ${menProducts.count} men's products\n`);
    
    // 3. Get subcategories
    console.log('3️⃣ Getting men\'s subcategories...');
    const subcategories = await fetch(`${API_BASE_URL}/products/Men/subcategories`).then(r => r.json());
    console.log(`   Subcategories: ${subcategories.data.join(', ')}\n`);
    
    // 4. Get filter options
    console.log('4️⃣ Getting men\'s filter options...');
    const filters = await fetch(`${API_BASE_URL}/products/Men/filters`).then(r => r.json());
    console.log(`   Colors: ${filters.data.colors.join(', ')}`);
    console.log(`   Sizes: ${filters.data.sizes.join(', ')}`);
    console.log(`   Materials: ${filters.data.materials.join(', ')}\n`);
    
    // 5. Get filtered products
    console.log('5️⃣ Getting men\'s jeans...');
    const jeans = await fetch(`${API_BASE_URL}/products?category=Men&subcategory=Jeans`).then(r => r.json());
    console.log(`   Found ${jeans.count} jeans\n`);
    
    // 6. Get products with price filter
    console.log('6️⃣ Getting products under $50...');
    const cheapProducts = await fetch(`${API_BASE_URL}/products?maxPrice=50`).then(r => r.json());
    console.log(`   Found ${cheapProducts.count} products under $50\n`);
    
    // 7. Get products with color filter
    console.log('7️⃣ Getting products in Blue...');
    const blueProducts = await fetch(`${API_BASE_URL}/products?color=Blue`).then(r => r.json());
    console.log(`   Found ${blueProducts.count} blue products\n`);
    
    // 8. Get products with search
    console.log('8️⃣ Searching for "jeans"...');
    const searchResults = await fetch(`${API_BASE_URL}/products?search=jeans`).then(r => r.json());
    console.log(`   Found ${searchResults.count} products matching "jeans"\n`);
    
    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();