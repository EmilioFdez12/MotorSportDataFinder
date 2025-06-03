const puppeteer = require('puppeteer');
const { DateTime } = require('luxon');
const flagMap = require('./flags.js');
const config = require('./calendarConfig.js');

// Convert date and time to ISO 8601 format (Europe/Madrid)
function toISODateTime(day, time) {
    try {
        const [dayNum, monthAbbr] = day.split(' ');
        const monthMap = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
            'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        const month = monthMap[monthAbbr];
        if (!month) throw new Error(`Invalid month: ${monthAbbr}`);

        const year = new Date().getFullYear();
        const dateStr = `${year}-${month}-${dayNum.padStart(2, '0')} ${time}`;
        const dt = DateTime.fromFormat(dateStr, 'yyyy-MM-dd HH:mm', { zone: 'Europe/Madrid' });

        if (!dt.isValid) throw new Error(`Invalid date/time: ${dateStr}`);
        return dt.toISO();
    } catch (error) {
        console.error(`Debug: Error converting to ISO: ${day} ${time} - ${error.message}`);
        return null;
    }
}

// Scrape calendar data
async function scrapeCalendar(category) {
    const { url, sessionMap } = config[category];
    let browser;
    try {
        // Launch browser
        console.log(`Debug: [${category}] Launching browser`);
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        // Create a new page
        const page = await browser.newPage();
        await page.emulateTimezone('Europe/Madrid');
        // Set user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Navigate to the schedule page
        console.log(`Debug: [${category}] Navigating to ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for expand buttons
        console.log(`Debug: [${category}] Waiting for expand buttons`);
        const expandButtons = await page.$$('.ms-schedule-table__expand');
        if (expandButtons.length === 0) {
            console.warn(`Debug: [${category}] No expand buttons found. Selector ".ms-schedule-table__expand" may be incorrect.`);
        } else {
            console.log(`Debug: [${category}] Found ${expandButtons.length} expand buttons`);
        }

        // Expand all race details
        for (let i = 0; i < expandButtons.length; i++) {
            try {
                await page.evaluate((index) => {
                    const button = document.querySelectorAll('.ms-schedule-table__expand')[index];
                    if (button) {
                        button.click();
                    } else {
                        console.warn(`Debug: Expand button ${index + 1} not found`);
                    }
                }, i);
                await page.waitForSelector(`tbody.ms-schedule-table__item:nth-child(${i + 1}) tr:not(:first-child)`, { timeout: 15000 }).catch(err => {
                    console.warn(`Debug: [${category}] Sub-rows for race ${i + 1} not found: ${err.message}`);
                });
                console.log(`Debug: [${category}] Expanded race ${i + 1}`);
            } catch (err) {
                console.error(`Debug: [${category}] Failed to expand race ${i + 1}: ${err.message}`);
            }
        }

        // Extract race data
        console.log(`Debug: [${category}] Extracting race data`);
        const races = await page.evaluate((flagMap, sessionMap, category) => {
            const raceElements = document.querySelectorAll('tbody.ms-schedule-table__item');
            console.log(`Debug: [${category}] Found ${raceElements.length} race elements`);
            const racesData = [];

            function normalizeText(text) {
                return text
                    .toLowerCase()
                    // Remove diacritics
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '');
            }

            function extractSessions(sessionElements, sessionMap) {
                const sessions = {};
                sessionElements.forEach((sessionElement) => {
                    const sessionTitle = sessionElement.querySelector('.ms-schedule-table-subevent-day__title')?.textContent.trim().toLowerCase();
                    const sessionDate = sessionElement.querySelector('.ms-schedule-table-subevent-day__date-value.ms-schedule-table-date--local')?.textContent.trim();
                    const sessionTime = sessionElement.querySelector('.ms-schedule-table-subevent-day__time.ms-schedule-table-date--local')?.textContent.trim();

                    console.log(`Debug: [${category}] Processing session title: ${sessionTitle}, date: ${sessionDate}, time: ${sessionTime}`);

                    if (!sessionDate || !sessionTime || sessionDate === 'TBD' || sessionTime === 'TBD') return;

                    // Find matching session key
                    const sessionKey = Object.keys(sessionMap).find(key => sessionTitle.includes(key));
                    if (sessionKey) {
                        sessions[sessionMap[sessionKey]] = { day: sessionDate, time: sessionTime };
                    } else {
                        console.warn(`Debug: [${category}] No session key found for title: ${sessionTitle}`);
                    }
                });
                return sessions;
            }

            raceElements.forEach((element, index) => {
                console.log(`Debug: [${category}] Processing race ${index + 1}`);

                // Extract GP name
                const gpNameElement = element.querySelector('.ms-schedule-table-item-main__event a span');
                let gpName = gpNameElement ? gpNameElement.textContent.trim() : 'Unknown GP';

                // Clean and format GP name
                let formattedGpName = gpName;

                // Extract main date
                const dateElement = element.querySelector('.ms-schedule-table-date__value');
                const dates = dateElement ? dateElement.textContent.trim() : 'TBD';

                // Normalize GP name for flag matching
                let normalizedGpName = formattedGpName
                    // Remove "GP"
                    .replace(/(GP de\s*)+/gi, '')
                    .replace('Arabia Saudí', 'Arabia')
                    .trim();

                // Special case for pre-season test
                if (gpName.includes('Test pretemporada')) {
                    normalizedGpName = 'Sakhir';
                }

                // Determine flag with flexible matching
                let flag = '/flags/unknown.webp';
                const countryKey = Object.keys(flagMap).find(key => {
                    const normalizedKey = normalizeText(key);
                    const normalizedGp = normalizeText(normalizedGpName);
                    return normalizedGp.includes(normalizedKey) || normalizedKey.includes(normalizedGp);
                });

                if (countryKey) {
                    flag = flagMap[countryKey];
                    console.log(`Debug: [${category}] Matched "${normalizedGpName}" to flag "${flag}" (key: ${countryKey})`);
                } else {
                    console.warn(`Debug: [${category}] No flag match for "${normalizedGpName}"`);
                }

                // Extract sessions
                const sessionElements = element.querySelectorAll('tr:not(:first-child)');
                console.log(`Debug: [${category}] Found ${sessionElements.length} session elements for race ${index + 1}`);
                const sessions = extractSessions(sessionElements, sessionMap);

                racesData.push({
                    gp: formattedGpName,
                    dates,
                    flag,
                    sessions
                });
            });

            return racesData;
        }, flagMap, sessionMap, category);

        console.log(`Debug: [${category}] Extracted ${races.length} races`);

        // Convert session times to ISO 8601
        console.log(`Debug: [${category}] Converting session times to ISO 8601`);
        for (const race of races) {
            for (const sessionKey in race.sessions) {
                const session = race.sessions[sessionKey];
                const isoDateTime = toISODateTime(session.day, session.time);
                if (isoDateTime) {
                    race.sessions[sessionKey] = { isoDateTime };
                } else {
                    delete race.sessions[sessionKey];
                }
            }
            console.log(`Debug: [${category}] Race "${race.gp}" has ${Object.keys(race.sessions).length} sessions`);
        }

        // Return races
        console.log(`Debug: [${category}] Returning ${races.length} races`);
        return races;
    } catch (error) {
        console.error(`Debug: [${category}] Error scraping calendar: ${error.message}`);
        return [];
    } finally {
        if (browser) {
            console.log(`Debug: [${category}] Closing browser`);
            await browser.close();
        }
    }
}

// Función para F1 (mantiene compatibilidad con versiones anteriores)
async function scrapeF1Calendar() {
    return scrapeCalendar('f1');
}

// Función para MotoGP
async function scrapeMotoGPCalendar() {
    return scrapeCalendar('motogp');
}

// Función para Indycar
async function scrapeIndycarCalendar() {
    return scrapeCalendar('indycar');
}

// Exportar funciones
module.exports = {
    scrapeF1Calendar,
    scrapeMotoGPCalendar,
    scrapeIndycarCalendar,
    scrapeCalendar,
};

// Si se ejecuta directamente, ejecutar ambos scrapers
if (require.main === module) {
    (async () => {
        try {
            console.log('Iniciando scraping de F1...');
            const f1Data = await scrapeF1Calendar();
            console.log(`Scraping de F1 completado. Obtenidos ${f1Data.length} eventos.`);

            console.log('Iniciando scraping de MotoGP...');
            const motoGPData = await scrapeMotoGPCalendar();
            console.log(`Scraping de MotoGP completado. Obtenidos ${motoGPData.length} eventos.`);

            console.log('Iniciando scraping de Indycar...');
            const indycarData = await scrapeIndycarCalendar();
            console.log(`Scraping de Indycar completado. Obtenidos ${indycarData.length} eventos.`);
        } catch (error) {
            console.error('Error durante el scraping:', error);
        }
    })();
}