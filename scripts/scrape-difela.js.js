// scripts/scrape-difela.js
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { stringify } from 'csv-stringify/sync';
import fs from 'fs';

puppeteer.use(StealthPlugin());

async function scrapeDifela() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  const page = await browser.newPage();

  // Spoof user-agent
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
  );

  // Bypass some headless detection
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  // Go to main site or the hymn listing page
  await page.goto('https://www.difelatsasione.co.za/', { waitUntil: 'networkidle2' });
  
  // You may need to wait for a navigation or challenge
  await page.waitForTimeout(5000);

  // Then navigate to the list of hymns page (if there’s a menu or link)
  // Example:
  // await page.click('a[href*="/hymns"]');
  // await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Extract hymn links
  const links = await page.$$eval('a', els =>
    els.map(el => el.href).filter(h => h.includes('/index.php?') && h.includes('song'))
  );

  console.log('Found hymn links:', links.length);

  const records = [];
  for (const url of links) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(2000);

      // Adjust selectors based on inspecting the actual hymn page
      const title = await page.$eval('h1', el => el.innerText.trim()).catch(() => '');
      const number = await page.$eval('.song-index', el => el.innerText.trim()).catch(() => '');
      const lyrics = await page.$eval('#lyrics', el => el.innerText.trim()).catch(() => '');
      
      records.push({
        book: 'Difela tsa Sione',
        number,
        title,
        language: 'sesotho',
        lyrics,
        verse_count: lyrics ? lyrics.split('\n\n').length : 0,
        chorus: '', 
        metadata: JSON.stringify({ source: url, extractedAt: new Date().toISOString() })
      });
      console.log('Scraped:', title);
    } catch (e) {
      console.error('Error scraping', url, e);
    }
    // Politeness delay
    await page.waitForTimeout(1000);
  }

  await browser.close();

  // Write to CSV
  const csv = stringify(records, {
    header: true,
    columns: ['book','number','title','language','lyrics','verse_count','chorus','metadata']
  });
  fs.writeFileSync('hymns-difela.csv', csv);
  console.log('Saved hymns-difela.csv with', records.length, 'records');
}

scrapeDifela().catch(err => {
  console.error('Fatal error in scraping difela:', err);
});
