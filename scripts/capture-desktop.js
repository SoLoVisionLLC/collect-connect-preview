let puppeteer;
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'qa-receipts', 'captures');

async function main() {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox','--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (const v of ['a','b','c']) {
    const url = `https://collect-connect-${v}.sololink.cloud/`;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => { for (const i of document.images) i.loading='eager'; await Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))); await document.fonts.ready; window.scrollTo(0,0); });
    await new Promise(r=>setTimeout(r,800));
    await page.screenshot({ path: path.join(OUT, `${v}_home_desktop_1440.png`), fullPage: true });
    console.log('OK', v);
  }
  await browser.close();
}
(async () => { const m = await import('puppeteer-core'); puppeteer = { launch: (o) => m.launch(o) }; await main(); })();
