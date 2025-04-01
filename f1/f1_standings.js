const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

async function scrapeF1Drivers() {
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

            await page.goto('https://www.formula1.com/en/results/2025/drivers', {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            await page.waitForSelector('tbody');

            const driversData = await page.evaluate(() => {
                const rows = Array.from(document.querySelectorAll('tr.bg-brand-white, tr.bg-grey-10'));

                return rows.map(row => {
                    const cells = row.querySelectorAll('td');
                    const position = cells[0]?.querySelector('p')?.textContent.trim() || '';

                    const driverCell = cells[1]?.querySelector('p a');
                    const driverFullName = driverCell ?
                        (driverCell.querySelector('.max-desktop\\:hidden')?.textContent || '') + ' ' +
                        (driverCell.querySelector('.max-tablet\\:hidden')?.textContent || '') : '';

                    const cleanDriverName = driverFullName.trim().replace(/[A-Z]{3}$/, '');
                    const car = cells[3]?.querySelector('p a')?.textContent.trim() || '';
                    const points = cells[4]?.querySelector('p')?.textContent.trim() || '';

                    return {
                        position,
                        driver: cleanDriverName,
                        team: car,
                        points
                    };
                }).filter(item => item.position && item.driver && item.team);
            });

            const dataDir = path.join(__dirname, '..', 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            const outputPath = path.join(dataDir, 'f1_standings.json');
            fs.writeFileSync(outputPath, JSON.stringify(driversData, null, 2));

            console.log('✅ Datos de pilotos de F1 guardados en data/f1_standings.json');
            await browser.close();
            return driversData;

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

module.exports = { scrapeF1Drivers };