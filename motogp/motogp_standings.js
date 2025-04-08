const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

async function scrapeMotoGPStandings() {
    let retries = 0;
    let browser;

    while (retries < MAX_RETRIES) {
        try {
            browser = await puppeteer.launch({
                headless: "new",
                defaultViewport: { width: 1920, height: 1080 },
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                timeout: 30000
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(30000);

            await page.goto('https://www.motogp.com/en/world-standing/2025/motogp/championship-standings', {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            await page.waitForSelector('.standings-table__body-row', { visible: true });
            await page.waitForSelector('.standings-table__rider-link', { visible: true });

            // Asegurarse de que estamos en la categoría MotoGP
            if (await page.$('.standings-menu__item[data-category="motogp"]') !== null) {
                await page.click('.standings-menu__item[data-category="motogp"]');
                await page.waitForTimeout(1000);
            }

            const standings = await page.evaluate(() => {
                const rows = document.querySelectorAll('.standings-table__body-row');
                return Array.from(rows).map(row => {
                    const position = row.querySelector('.standings-table__body-cell--pos')?.textContent.trim();
                    const riderName = row.querySelector('.standings-table__rider-link')?.textContent.trim()
                        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
                        .trim();
                    const team = row.querySelector('.standings-table__body-cell--team')?.textContent.trim();
                    // Limpiar el formato de puntos para eliminar cualquier texto adicional
                    let points = row.querySelector('.standings-table__body-cell--points')?.textContent.trim();
                    // Extraer solo el número de puntos (antes del guión si existe)
                    points = points.split('-')[0].trim();

                    return {
                        position,
                        name: riderName,
                        team,
                        points
                    };
                });
            });

            // Filtrar solo pilotos de MotoGP (los primeros 23) y eliminar duplicados
            const uniqueRiders = [];
            const riderNames = new Set();
            const maxMotoGPRiders = 23; // Limitar a los 23 pilotos de MotoGP
            
            for (const rider of standings) {
                // Asegurarse de que todos los campos necesarios existen y no exceder el límite de pilotos
                if (rider.name && rider.team && rider.points && !riderNames.has(rider.name) && uniqueRiders.length < maxMotoGPRiders) {
                    riderNames.add(rider.name);
                    uniqueRiders.push(rider);
                }
            }

            const dataDir = path.join(__dirname, '..', 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            const outputPath = path.join(dataDir, 'motogp_standings.json');
            fs.writeFileSync(outputPath, JSON.stringify(uniqueRiders, null, 2));

            console.log('✅ Datos de pilotos de MotoGP guardados en data/motogp_standings.json');
            await browser.close();
            return uniqueRiders;

        } catch (error) {
            retries++;
            console.error(`❌ Error en intento ${retries}/${MAX_RETRIES}:`, error);
            
            if (browser) {
                await browser.close();
            }
            
            if (retries === MAX_RETRIES) {
                throw new Error(`Failed after ${MAX_RETRIES} retries: ${error.message}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }
}

module.exports = { scrapeMotoGPStandings };