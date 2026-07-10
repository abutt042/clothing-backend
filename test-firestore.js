// test-firestore.js
const { db } = require('./src/config/firebase');

async function testFirestore() {
  try {
    console.log('🔍 Testing Firestore connection...');
    console.log('📁 Project: clothing-bakend');
    
    // Test 1: Try to write a test document
    console.log('\n📝 Test 1: Writing to Firestore...');
    const testRef = db.collection('test').doc('test-doc');
    await testRef.set({
      message: 'Firestore is working!',
      timestamp: new Date().toISOString(),
      test: true
    });
    console.log('✅ Write successful!');
    
    // Test 2: Try to read it back
    console.log('\n📖 Test 2: Reading from Firestore...');
    const doc = await testRef.get();
    if (doc.exists) {
      console.log('✅ Read successful!');
      console.log('📄 Data:', doc.data());
    } else {
      console.log('❌ Document not found');
    }
    
    // Test 3: Try to read products collection
    console.log('\n📦 Test 3: Checking products collection...');
    const productsSnapshot = await db.collection('products').limit(5).get();
    console.log(`✅ Found ${productsSnapshot.size} products`);
    
    if (productsSnapshot.size > 0) {
      productsSnapshot.forEach(doc => {
        console.log(`   - ${doc.id}: ${doc.data().name || 'Unnamed product'}`);
      });
    } else {
      console.log('   No products found. Run: npm run seed');
    }
    
    // Test 4: Try to read categories collection
    console.log('\n📁 Test 4: Checking categories collection...');
    const categoriesSnapshot = await db.collection('categories').get();
    console.log(`✅ Found ${categoriesSnapshot.size} categories`);
    
    if (categoriesSnapshot.size > 0) {
      categoriesSnapshot.forEach(doc => {
        console.log(`   - ${doc.id}: ${doc.data().name || 'Unnamed category'}`);
      });
    } else {
      console.log('   No categories found. Run: npm run seed');
    }
    
    // Clean up test document
    console.log('\n🧹 Cleaning up test document...');
    await testRef.delete();
    console.log('✅ Cleanup successful!');
    
    console.log('\n🎉 All tests passed! Firestore is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Firestore test failed:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('PERMISSION_DENIED')) {
      console.error('\n💡 Solution:');
      console.error('1. Go to Firebase Console');
      console.error('2. Select your project: clothing-bakend');
      console.error('3. Click on "Firestore Database"');
      console.error('4. Click "Rules" tab');
      console.error('5. Set rules to:');
      console.error('   rules_version = \'2\';');
      console.error('   service cloud.firestore {');
      console.error('     match /databases/{database}/documents {');
      console.error('       match /{document=**} {');
      console.error('         allow read, write: if true;');
      console.error('       }');
      console.error('     }');
      console.error('   }');
      console.error('6. Click "Publish"');
      console.error('7. Wait 1-2 minutes');
      console.error('8. Run this test again');
    } else if (error.message.includes('SERVICE_DISABLED')) {
      console.error('\n💡 Solution:');
      console.error('1. Enable Firestore API at:');
      console.error('   https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=clothing-bakend');
      console.error('2. Click "ENABLE"');
      console.error('3. Wait 2-3 minutes');
      console.error('4. Run this test again');
    } else if (error.message.includes('not found')) {
      console.error('\n💡 Solution:');
      console.error('1. Check if firebase-credentials.json exists in project root');
      console.error('2. Verify the file has valid JSON');
      console.error('3. Check if project ID matches: clothing-bakend');
    } else {
      console.error('\n💡 General troubleshooting:');
      console.error('1. Check your internet connection');
      console.error('2. Verify Firebase credentials are valid');
      console.error('3. Make sure Firestore is enabled in Firebase Console');
    }
  }
}

// Run the test
testFirestore();