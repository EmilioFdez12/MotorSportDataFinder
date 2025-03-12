// Import the Firebase Admin SDK
const admin = require('firebase-admin');
const path = require('path');

// Get the service account key file path
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccount.json');

// Initialize Firebase Admin with your project credentials
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath))
});

// Get Firestore database
const db = admin.firestore();

module.exports = { db, admin };