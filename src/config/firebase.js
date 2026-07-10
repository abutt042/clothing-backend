const admin = require('firebase-admin');
const serviceAccount = require('../../firebase-credentials.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();
const auth = admin.auth();

// Collection names
const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  USERS: 'users',
  CART: 'carts'
};

module.exports = { admin, db, auth, COLLECTIONS };