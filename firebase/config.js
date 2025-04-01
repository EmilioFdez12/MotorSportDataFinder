// Import the Firebase Admin SDK
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin with credentials
try {
  // First try environment variables
  if (process.env.FIREBASE_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS))
    });
  } else {
    // Fallback to service account file
    const serviceAccountPath = path.join(__dirname, '..', 'serviceAccount.json');
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath))
    });
  }
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  process.exit(1);
}

// Get Firestore database
const db = admin.firestore();

module.exports = { db, admin };