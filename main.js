// Load environment variables from .env file
require('dotenv').config();

const path = require('path');

// Importar las funciones de scraping
const { scrapeF1Drivers } = require('./f1/f1_standings');
const { generateConstructorsStandings } = require('./f1/f1_constructors_standings');
const { scrapeMotoGPStandings } = require('./motogp/motogp_standings');
const { generateMotoGPConstructorsStandings } = require('./motogp/motogp_constructors_standings');

// Importar servicio de Firebase
const { uploadDataIfChanged } = require('./firebase/service');

async function runAllScrapers() {
    console.log('🚀 Iniciando proceso de scraping...');
    
    try {
        // Ejecutar scraping de F1 pilotos
        console.log('\n📊 Obteniendo datos de pilotos de F1...');
        await scrapeF1Drivers();
        
        // Generar clasificación de constructores F1
        console.log('\n🏎️ Generando clasificación de constructores de F1...');
        generateConstructorsStandings();
        
        // Ejecutar scraping de MotoGP
        console.log('\n🏍️ Obteniendo datos de MotoGP...');
        await scrapeMotoGPStandings();
        
        // Generar clasificación de constructores MotoGP
        console.log('\n🏍️ Generando clasificación de constructores de MotoGP...');
        generateMotoGPConstructorsStandings();
        
        // Subir datos a Firebase si hay cambios
        console.log('\n🔄 Verificando cambios y subiendo a Firebase...');
        await uploadDataIfChanged('f1_standings');
        await uploadDataIfChanged('f1_constructors_standings');
        await uploadDataIfChanged('motogp_standings');
        await uploadDataIfChanged('motogp_constructors_standings');
        
        console.log('\n✅ Proceso completado con éxito!');
    } catch (error) {
        console.error('\n❌ Error durante el proceso:', error);
    }
}

// Ejecutar todos los scrapers
runAllScrapers();