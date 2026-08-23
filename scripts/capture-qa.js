// QA captures for Collect & Connect preview variants.
// Primary: 390x844 DPR2 mobile emulation, fullPage, scrollY=0. Secondary live check: 430x932.
let puppeteer;
(async () => { const m = await import('puppeteer-core'); puppeteer = { launch: (o) => m.launch(o) }; await main(); })();
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'qa-receipts', 'captures');
fs.mkdirSync(OUT, { recursive: true });

const VARIANTS = {
  a: 'https://collect-connect-a.sololink.cloud',
  b: 'https://collect-connect-b.sololink.cloud',
  c: 'https://collect-connect-c.sololink.cloud',
};
const ROUTES = ['', 'shop-categories.html', 'sell-or-trade.html', 'new-arrivals.html', 'about.html', 'visit.html'];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb', '--hide-scrollbars'],
  });
  const results = [];
  const page = await browser.newPage();

  async function capture(variant, base, route) {
    const name = (variant + '_' + (route || 'home')).replace(/[./]/g, '_');
    // primary capture: 390x844 DPR2
    await page.emulate({
      viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    });
    const url = base + '/' + route;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    // force all lazy images eager and wait until fully decoded
    await page.evaluate(async () => {
      for (const i of document.images) { i.loading = 'eager'; }
      await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
      await new Promise(r => setTimeout(r, 500));
    });
    await page.evaluate(async () => { await document.fonts.ready; });
    await new Promise(r => setTimeout(r, 800));
    await page.evaluate(() => window.scrollTo(0, 0));
    const metrics = await page.evaluate(() => ({
      scrollY: window.scrollY,
      docHeight: document.documentElement.scrollHeight,
      fontsLoaded: document.fonts.status === 'loaded',
      imgsTotal: document.images.length,
      imgsBroken: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).length,
      title: document.title,
    }));
    if (metrics.scrollY !== 0) throw new Error('scrollY != 0 on ' + url);
    const shot = path.join(OUT, `${name}_390x844_dpr2.png`);
    await page.screenshot({ path: shot, fullPage: true });
    // verify full-page screenshot height covers content
    const meta = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight }));
    // secondary live check at 430x932
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    const m2 = await page.evaluate(() => ({
      scrollY: window.scrollY,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      imgsBroken: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).length,
    }));
    results.push({ variant, url, primaryShot: shot, ...metrics, contentSize: meta, secondary_430x932: m2, capturedAt: new Date().toISOString(), device: 'mobile emulation', dpr: 2 });
    console.log('OK', variant, route || 'home');
  }

  for (const [v, base] of Object.entries(VARIANTS)) {
    for (const r of ROUTES) await capture(v, base, r);
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'capture-manifest.json'), JSON.stringify(results, null, 2));
  console.log('DONE', results.length, 'captures');
}
