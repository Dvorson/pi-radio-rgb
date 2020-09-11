const puppeteer = require('puppeteer');
const Promise = require('bluebird');

const { getLocalStations } = require('./external/radio.net');

async function preload(url) {
    if (!browser) browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--mute-audio'],
        ...(os.platform() === 'linux' && { executablePath: 'chromium-browser', args: ['--no-sandbox'] })
    });
    const urlPage = await browser.newPage();
    await urlPage.goto(url);
    await urlPage.evaluate(() => document.getElementsByTagName('video')[0].pause());
    return urlPage;
}

(async () => {
    const stations = await getLocalStations();
    const streamUrls = stations.map(({ streamUrls }) => streamUrls[0].streamUrl);
    pages = await Promise.reduce(streamUrls, async (acc, url) => ({ ...acc, [url]: await preload(url) }), {});
    console.log({ pages });
})