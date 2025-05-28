const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config/standingsConfig');

async function getStandings(category) {
  try {
    const categoryConfig = config[category];
    if (!categoryConfig) {
      throw new Error(`Categoría no soportada: ${category}`);
    }

    const { url, teamMap, driverInfo } = categoryConfig;
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const drivers = [];
    let driverId = 1;

    // Scrape driver standings
    $('tr.ms-table_row').each((_, row) => {
      const columns = $(row).find('td');

      if (columns.length < 3) return;

      const pos = parseInt($(columns[0]).text().trim());
      const driverCell = $(columns[1]);

      const shortName = driverCell.find('.name-short').text().trim();
      const team = driverCell.find('.team').text().trim();
      const points = parseInt($(columns[2]).text().trim()) || 0;

      const info = driverInfo[shortName];
      if (!info) {
        console.warn(`Piloto no encontrado en el mapa: ${shortName}`);
        return;
      }

      const teamInfo = teamMap[team];
      if (!teamInfo) {
        console.warn(`Equipo no encontrado en el mapa: ${team}`);
        return;
      }

      drivers.push({
        id: driverId++,
        position: pos,
        points,
        name: info.name,
        teamId: teamInfo.id,
        team: teamInfo.name,
        number: info.number,
        portrait: info.portrait,
        teamCar: teamInfo.car,
        teamLogo: teamInfo.logo
      });
    });

    // Calculate constructor standings
    const constructorMap = {};
    drivers.forEach(driver => {
      const teamId = driver.teamId;
      if (!constructorMap[teamId]) {
        constructorMap[teamId] = {
          teamId,
          team: driver.team,
          points: 0,
          logo: driver.teamLogo,
          car: driver.teamCar
        };
      }
      constructorMap[teamId].points += driver.points;
    });

    // Convert constructor map to array and sort by points
    const constructors = Object.values(constructorMap)
      .sort((a, b) => b.points - a.points) // Sort descending by points
      .map((constructor, index) => ({
        id: index + 1,
        position: index + 1,
        teamId: constructor.teamId,
        team: constructor.team,
        points: constructor.points,
        logo: constructor.logo,
        car: constructor.car
      }));

    return { drivers, constructors };
  } catch (error) {
    console.error(`Error al obtener las clasificaciones de ${category}:`, error);
    return { drivers: [], constructors: [] };
  }
}

module.exports = getStandings;