const axios = require('axios');
const cheerio = require('cheerio');

const TEAM_MAP = {
  "Red Bull Racing": { id: 1, name: "Red Bull Racing Honda RBPT" },
  "Ferrari": { id: 2, name: "Ferrari" },
  "McLaren F1": { id: 3, name: "McLaren Mercedes" },
  "Mercedes": { id: 4, name: "Mercedes" },
  "Aston Martin Racing": { id: 5, name: "Aston Martin Aramco Mercedes" },
  "Alpine": { id: 6, name: "Alpine Renault" },
  "Racing Bulls": { id: 7, name: "Racing Bulls Honda RBPT" },
  "Williams": { id: 8, name: "Williams Mercedes" },
  "Sauber F1 Team": { id: 9, name: "Kick Sauber Ferrari" },
  "Haas F1 Team": { id: 10, name: "Haas Ferrari" }
};

const TEAM_ASSETS = {
  1: { car: "/f1/images/cars/red-bull-racing.webp", logo: "/f1/images/logos/redbull.webp" },
  2: { car: "/f1/images/cars/ferrari.webp", logo: "/f1/images/logos/ferrari.webp" },
  3: { car: "/f1/images/cars/mclaren.webp", logo: "/f1/images/logos/mclaren.webp" },
  4: { car: "/f1/images/cars/mercedes.webp", logo: "/f1/images/logos/mercedes.webp" },
  5: { car: "/f1/images/cars/aston-martin.webp", logo: "/f1/images/logos/astonmartin.webp" },
  6: { car: "/f1/images/cars/alpine.webp", logo: "/f1/images/logos/alpine.webp" },
  7: { car: "/f1/images/cars/racing-bulls.webp", logo: "/f1/images/logos/racingbulls.webp" },
  8: { car: "/f1/images/cars/williams.webp", logo: "/f1/images/logos/williams.webp" },
  9: { car: "/f1/images/cars/kick-sauber.webp", logo: "/f1/images/logos/stake.webp" },
  10: { car: "/f1/images/cars/haas.webp", logo: "/f1/images/logos/haas.webp" }
};

(async () => {
  const url = "https://es.motorsport.com/f1/standings/2025/";
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  const teamPointsMap = {};

  $('tr.ms-table_row').each((_, row) => {
    const columns = $(row).find('td');
    if (columns.length < 3) return;

    const team = $(columns[1]).find('.team').text().trim();
    const pointsText = $(columns[2]).text().trim();
    const points = parseInt(pointsText) || 0;

    const teamData = TEAM_MAP[team];
    if (!teamData) {
      console.warn("Equipo no encontrado:", team);
      return;
    }

    if (!teamPointsMap[teamData.id]) {
      teamPointsMap[teamData.id] = 0;
    }

    teamPointsMap[teamData.id] += points;
  });

  const constructors = Object.entries(TEAM_MAP).map(([_, { id, name }]) => ({
    teamId: id,
    team: name,
    car: TEAM_ASSETS[id].car,
    logo: TEAM_ASSETS[id].logo,
    points: teamPointsMap[id] || 0
  }));

  // Ordenamos por puntos descendente y asignamos posición
  constructors.sort((a, b) => b.points - a.points);
  constructors.forEach((team, index) => {
    team.position = index + 1;
  });

  console.log(JSON.stringify({ constructors }, null, 2));
})();
