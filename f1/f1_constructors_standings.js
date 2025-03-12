const fs = require('fs');
const path = require('path');

function generateConstructorsStandings() {
    try {
        // Get path to data directory
        const dataDir = path.join(__dirname, '..', 'data');
        
        // Create data directory if it doesn't exist
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Leer el archivo de pilotos desde la carpeta data
        const driversPath = path.join(dataDir, 'f1_standings.json');
        const driversData = JSON.parse(fs.readFileSync(driversPath, 'utf8'));
        
        // Objeto para almacenar los puntos por constructor
        const constructorsPoints = {};
        
        // Sumar los puntos de cada piloto a su equipo correspondiente
        driversData.forEach(driver => {
            const team = driver.team;
            const points = parseInt(driver.points);
            
            if (constructorsPoints[team]) {
                constructorsPoints[team] += points;
            } else {
                constructorsPoints[team] = points;
            }
        });
        
        // Convertir a array y ordenar por puntos
        const constructorsStandings = Object.entries(constructorsPoints).map(([team, points]) => ({
            team,
            points: points.toString()
        }));
        
        // Ordenar por puntos (de mayor a menor)
        constructorsStandings.sort((a, b) => parseInt(b.points) - parseInt(a.points));
        
        // Añadir posición
        const finalStandings = constructorsStandings.map((constructor, index) => ({
            position: (index + 1).toString(),
            team: constructor.team,
            points: constructor.points
        }));
        
        // Guardar en un nuevo archivo JSON en la carpeta data
        const outputPath = path.join(dataDir, 'f1_constructors_standings.json');
        fs.writeFileSync(outputPath, JSON.stringify(finalStandings, null, 2));
        
        console.log('✅ Clasificación de constructores F1 guardada en data/f1_constructors_standings.json');
        return finalStandings;
        
    } catch (error) {
        console.error('❌ Error generando clasificación de constructores:', error);
        throw error;
    }
}

module.exports = { generateConstructorsStandings };