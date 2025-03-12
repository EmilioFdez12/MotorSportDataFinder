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
    
    // Intentar obtener el último documento
    let shouldUpload = true;
    
    try {
      const lastEntryQuery = await dataCollection.orderBy('timestamp', 'desc').limit(1).get();
      
      // Comparar con los últimos datos en Firebase
      if (!lastEntryQuery.empty) {
        const lastEntry = lastEntryQuery.docs[0].data();
        // Comparar solo los datos, no el timestamp
        const lastData = lastEntry.data;
        
        // Comparación profunda de objetos JSON
        shouldUpload = JSON.stringify(currentData) !== JSON.stringify(lastData);
      }
    } catch (error) {
      // Si la colección no existe, simplemente continuamos con la subida
      console.log(`ℹ️ Colección ${dataType} no encontrada, se creará automáticamente`);
    }
    
    // Subir si hay cambios o no hay datos previos
    if (shouldUpload) {
      await dataCollection.add({
        data: currentData,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Datos de ${dataType} subidos a Firebase`);
      return true;
    } else {
      console.log(`ℹ️ No hay cambios en ${dataType}, no se sube a Firebase`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error al subir ${dataType} a Firebase:`, error);
    return false;
  }
}

module.exports = { uploadDataIfChanged };