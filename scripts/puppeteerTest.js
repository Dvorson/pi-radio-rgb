const puppeteer = require('puppeteer');
const Promise = require('bluebird');
const os = require('os');

const { getLocalStations } = require('../lib/external/radio.net');

let browser;

async function preload(url) {
    const urlPage = await browser.newPage();
    await urlPage.goto(url);
    await urlPage.evaluate(() => document.getElementsByTagName('video')[0].pause());
    return urlPage;
}

(async () => {
    if (!browser) browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--mute-audio'],
        ...(os.platform() === 'linux' && { executablePath: 'chromium-browser', args: ['--no-sandbox'] })
    });
    const stations = await getLocalStations();
    const streamUrls = stations.map(({ streamUrls }) => streamUrls[0].streamUrl);
    pages = await Promise.reduce(streamUrls, async (acc, url) => ({ ...acc, [url]: await preload(url) }), {});
    console.log({ pages });
    process.exit();
})();
