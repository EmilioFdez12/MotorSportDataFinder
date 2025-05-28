const admin = require('firebase-admin');
const fs = require('fs').promises;
// Path module for handling file paths
const path = require('path');
const getStandings = require('./standings/getStandings');
const { scrapeF1Calendar, scrapeMotoGPCalendar, scrapeIndycarCalendar } = require('./schedule/getCalendar');

// Initialize Firebase
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require('./serviceAccount.json');
}

// Initialize the Firebase app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Function to process standings for different categories and upload to Firestore
async function processStandings() {
  const categories = ['f1', 'motogp', 'indycar'];

  for (const category of categories) {
    // Get standings data for the current category
    console.log(`\nObteniendo clasificaciones de ${category.toUpperCase()}:`);
    const standings = await getStandings(category);

    // Upload driver standings to Firestore
    try {
      await uploadStandingsData(`${category}_standings`, 'drivers', standings.drivers);
      console.log(`Clasificaciones de pilotos de ${category.toUpperCase()} subidas a Firestore`);
    } catch (error) {
      console.error(`Error al procesar las clasificaciones de pilotos de ${category}:`, error);
    }

    // Upload constructor standings to Firestore
    try {
      await uploadStandingsData(`${category}_constructors`, 'constructors', standings.constructors);
      console.log(`Clasificaciones de constructores de ${category.toUpperCase()} subidas a Firestore`);
    } catch (error) {
      console.error(`Error al procesar las clasificaciones de constructores de ${category}:`, error);
    }
  }
}

// Function to upload standings data directly to Firestore
async function uploadStandingsData(collectionName, dataKey, data) {
  try {
    // Get a reference to the Firestore collection
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    // Add each item to the batch
    data.forEach(item => {
      const docRef = collectionRef.doc(`${dataKey === 'drivers' ? 'driver' : 'constructor'}_${item.id.toString().padStart(2, '0')}`);
      batch.set(docRef, item);
    });

    // Commit the batch
    await batch.commit();
    console.log(`Clasificaciones de ${collectionName} subidas exitosamente a Firestore`);
  } catch (error) {
    console.error(`Error al subir las clasificaciones a ${collectionName}:`, error);
    // Re-throw the error to be caught by the calling function
    throw error;
  }
}

// Function to process calendars for different series
async function processCalendars() {
  const calendarFunctions = [
    { fn: scrapeF1Calendar, collection: 'f1_schedule' },
    { fn: scrapeMotoGPCalendar, collection: 'motogp_schedule' },
    { fn: scrapeIndycarCalendar, collection: 'indycar_schedule' }
  ];

  for (const { fn, collection } of calendarFunctions) {
    console.log(`\nIniciando scraping de ${collection}...`);
    try {
      // Execute the scraping function for the current calendar
      const calendarData = await fn();
      console.log(`Scraping de ${collection} completado.`);

      // Upload to Firestore directly
      await uploadCalendarData(calendarData, collection);
    } catch (error) {
      console.error(`Error al procesar el calendario ${collection}:`, error);
    }
  }
}

// Function to upload calendar data directly to Firestore
async function uploadCalendarData(calendarData, collectionName) {
  try {
    // Get a reference to the Firestore collection
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    // Add each event to the batch with formatted ID
    calendarData.forEach((event, index) => {
      const eventNumber = (index + 1).toString().padStart(2, '0');
      const docRef = collectionRef.doc(`event_${eventNumber}`);
      batch.set(docRef, event);
    });

    // Commit the batch
    await batch.commit();
    console.log(`Calendario subido exitosamente a ${collectionName}`);
  } catch (error) {
    console.error(`Error al subir el calendario a ${collectionName}:`, error);
    // Re-throw the error to be caught by the calling function
    throw error;
  }
}

// Get the command line argument to determine which task to run
// process.argv[0] is 'node', process.argv[1] is the script file path
const command = process.argv[2];

async function runTask() {
  try {
    console.log('Iniciando proceso...');

    if (command === 'standings') {
      // Process only standings
      await processStandings();
    } else if (command === 'calendar') {
      // Process only calendars
      await processCalendars();
    } else if (command === 'all') {
      // Process both
      await processStandings();
      await processCalendars();
    } else {
      console.log('Comando no reconocido. Uso: node main.js [standings|calendar|all]');
    }

    console.log('Proceso completado.');
  } catch (error) {
    console.error('Error en el proceso:', error);
  } finally {
    // Ensure Firebase app is deleted after the task completes or fails
    await admin.app().delete();
    console.log('Conexión con Firebase cerrada.');
  }
}

// Execute task
runTask();