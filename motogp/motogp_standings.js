const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeMotoGPStandings() {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: { width: 1920, height: 1080 }
        });
        const page = await browser.newPage();

        await page.goto('https://www.motogp.com/en/world-standing/2025/motogp/championship-standings', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for specific elements to be loaded
        await page.waitForSelector('.standings-table__body-row', { visible: true });
        await page.waitForSelector('.standings-table__rider-link', { visible: true });

        // Asegurarnos de que estamos en la categoría MotoGP
        // Verificar si hay un selector de categoría y hacer clic en MotoGP si es necesario
        if (await page.$('.standings-menu__item[data-category="motogp"]') !== null) {
            await page.click('.standings-menu__item[data-category="motogp"]');
            await page.waitForTimeout(1000); // Esperar a que se cargue la nueva categoría
        }

        const standings = await page.evaluate(() => {
            const rows = document.querySelectorAll('.standings-table__body-row');
            return Array.from(rows).map(row => {
                const position = row.querySelector('.standings-table__body-cell--pos')?.textContent.trim();
                const number = row.querySelector('.standings-table__body-cell--number')?.textContent.trim();
                const riderName = row.querySelector('.standings-table__rider-link')?.textContent.trim().replace("\s", "");
                const team = row.querySelector('.standings-table__body-cell--team')?.textContent.trim();
                const points = row.querySelector('.standings-table__body-cell--points')?.textContent.trim();

                return {
                    position,
                    number,
                    rider: riderName,
                    team,
                    points
                };
            });
        });

        await browser.close();

        // Eliminar duplicados basados en el número del piloto
        const uniqueRiders = [];
        const riderNumbers = new Set();
        
        for (const rider of standings) {
            if (!riderNumbers.has(rider.number)) {
                riderNumbers.add(rider.number);
                uniqueRiders.push(rider);
            }
        }
        
        // Filtrar solo pilotos de MotoGP (verificando nombres de equipos)
        const motogpTeams = [
            "Ducati Lenovo Team",
            "Monster Energy Yamaha MotoGP Team",
            "Aprilia Racing",
            "Repsol Honda Team",
            "Red Bull KTM Factory Racing",
            "Gresini Racing MotoGP",
            "Prima Pramac Racing",
            "LCR Honda",
            "Trackhouse Racing",
            "Tech3 GASGAS Factory Racing",
            "VR46 Racing Team",
            "BK8 Gresini Racing MotoGP",
            "Pertamina Enduro VR46 Racing Team",
            "Prima Pramac Yamaha MotoGP",
            "Honda HRC Castrol",
            "Monster Energy Yamaha MotoGP Team"
        ];
        
        // Create data directory if it doesn't exist
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Save data to JSON file
        const outputPath = path.join(dataDir, 'motogp_standings.json');
        fs.writeFileSync(outputPath, JSON.stringify(uniqueRiders, null, 2));
        
        console.log('✅ Datos de MotoGP guardados en data/motogp_standings.json');
        return uniqueRiders;
        
    } catch (error) {
        console.error('❌ Error al obtener datos de MotoGP:', error);
        throw error;
    }
}

module.exports = { scrapeMotoGPStandings };