const fs = require('fs');
const path = require('path');
const { db } = require('./config');
const admin = require('firebase-admin');

// Función para comparar datos y subir a Firebase si hay cambios
async function uploadDataIfChanged(dataType) {
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    const filePath = path.join(dataDir, `${dataType}.json`);
    
    // Leer datos actuales
    const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Referencia a la colección
    const dataCollection = db.collection(dataType);
    
    let shouldUpload = true;
    
    try {
      // Obtener el último documento de la colección
      const lastEntryQuery = await dataCollection
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();
      
      // Comparar con los datos existentes en Firebase
      if (!lastEntryQuery.empty) {
        const lastEntry = lastEntryQuery.docs[0].data();
        const lastData = lastEntry.data;
        
        // Comparación profunda de objetos
        shouldUpload = JSON.stringify(currentData) !== JSON.stringify(lastData);
      }
    } catch (error) {
      console.log(`ℹ️ No se encontraron datos previos en ${dataType}, se procederá con la subida`);
    }
    
    if (shouldUpload) {
      // Usar un ID fijo para actualizar el documento
      const docId = `${dataType}_latest`;
      
      // Actualizar o crear el documento con los nuevos datos
      await dataCollection.doc(docId).set({
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