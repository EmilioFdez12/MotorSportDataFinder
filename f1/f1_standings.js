const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeF1Drivers() {
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: { width: 1920, height: 1080 }
    });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.formula1.com/en/results/2024/drivers', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for the table content to load
        await page.waitForSelector('tbody');

        // Extract data from the drivers standings table with updated selectors
        const driversData = await page.evaluate(() => {
            // Seleccionar todas las filas, tanto bg-brand-white como bg-grey-10
            const rows = Array.from(document.querySelectorAll('tr.bg-brand-white, tr.bg-grey-10'));

            return rows.map(row => {
                const cells = row.querySelectorAll('td');

                // Extract text content from each cell
                const position = cells[0]?.querySelector('p')?.textContent.trim() || '';

                // For driver name, we need to handle the different display formats
                const driverCell = cells[1]?.querySelector('p a');
                const driverFullName = driverCell ?
                    (driverCell.querySelector('.max-desktop\\:hidden')?.textContent || '') + ' ' +
                    (driverCell.querySelector('.max-tablet\\:hidden')?.textContent || '') : '';

                // Eliminar el código de tres letras en mayúscula al final del nombre
                const cleanDriverName = driverFullName.trim().replace(/[A-Z]{3}$/, '');

                // No necesitamos la nacionalidad, pero mantenemos la estructura del objeto
                const car = cells[3]?.querySelector('p a')?.textContent.trim() || '';
                const points = cells[4]?.querySelector('p')?.textContent.trim() || '';

                return {
                    position,
                    driver: cleanDriverName,
                    team: car,
                    points
                };
            }).filter(item => item.position && item.driver && item.team); // Filtrar filas vacías
        });

        // Create data directory if it doesn't exist
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Save data to JSON file
        const outputPath = path.join(dataDir, 'f1_standings.json');
        fs.writeFileSync(outputPath, JSON.stringify(driversData, null, 2));

        console.log('✅ Datos de pilotos de F1 guardados en data/f1_standings.json');
        return driversData;

    } catch (error) {
        console.error('❌ Error al obtener datos de F1:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeF1Drivers };