const fs = require('fs');
const path = require('path');
const { db } = require('./config');
const admin = require('firebase-admin');

async function uploadDataIfChanged(dataType) {
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    const filePath = path.join(dataDir, `${dataType}.json`);
    
    const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const dataCollection = db.collection(dataType);
    
    let shouldUpload = true;
    
    try {
      const lastEntryQuery = await dataCollection
        .doc('latest')
        .get();
      
      if (lastEntryQuery.exists) {
        const lastEntry = lastEntryQuery.data();
        shouldUpload = JSON.stringify(currentData) !== JSON.stringify(lastEntry.data);
      }
    } catch (error) {
      console.log(`ℹ️ No se encontraron datos previos en ${dataType}, se procederá con la subida`);
    }
    
    if (shouldUpload) {
      await dataCollection.doc('latest').set({
        data: currentData,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Datos de ${dataType} actualizados en Firebase`);
      return true;
    } else {
      console.log(`ℹ️ No hay cambios en ${dataType}, no se actualiza en Firebase`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error al subir ${dataType} a Firebase:`, error);
    return false;
  }
}

module.exports = { uploadDataIfChanged };