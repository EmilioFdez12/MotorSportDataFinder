const fs = require('fs');
const path = require('path');

function generateMotoGPConstructorsStandings() {
    try {
        // Get path to data directory
        const dataDir = path.join(__dirname, '..', 'data');
        
        // Create data directory if it doesn't exist
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Leer el archivo de pilotos desde la carpeta data
        const ridersPath = path.join(dataDir, 'motogp_standings.json');
        const ridersData = JSON.parse(fs.readFileSync(ridersPath, 'utf8'));
        
        // Objeto para almacenar los puntos por constructor
        const constructorsPoints = {};
        
        // Sumar los puntos de cada piloto a su equipo correspondiente
        ridersData.forEach(rider => {
            const team = rider.team;
            const points = parseInt(rider.points);
            
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
        const outputPath = path.join(dataDir, 'motogp_constructors_standings.json');
        fs.writeFileSync(outputPath, JSON.stringify(finalStandings, null, 2));
        
        console.log('✅ Clasificación de constructores MotoGP guardada en data/motogp_constructors_standings.json');
        return finalStandings;
        
    } catch (error) {
        console.error('❌ Error generando clasificación de constructores MotoGP:', error);
        throw error;
    }
}

module.exports = { generateMotoGPConstructorsStandings };