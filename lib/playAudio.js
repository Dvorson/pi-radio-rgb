const puppeteer = require('puppeteer');
const MPlayer = require('mplayer');
const loudness = require('loudness');
const Promise = require('bluebird');

const { getLocalStations } = require('./external/radio.net');

const player = new MPlayer({
    verbose: true,
    debug: true,
    args: ['-quiet']
});

player.volume(100);

let page;
let pages;
let browser;
(async () => {
    const stations = await getLocalStations();
    console.log({ stations });
    const streamUrls = stations.map(({ streamUrls }) => streamUrls[0].streamUrl);
    console.log({ streamUrls });
    pages = await Promise.reduce(streamUrls, async (acc, url) => ({ ...acc, [url]: await preload(url) }), {});
})();

async function getPage() {
    if (page && !page.isClosed()) return page;
    try {
        if (!browser) browser = await puppeteer.launch({
            ignoreDefaultArgs: ['--mute-audio']
        });
        return browser.newPage();
    } catch (e) {
        console.error(e);
    }
}

async function preload(url) {
    if (!browser) browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--mute-audio']
    });
    const urlPage = await browser.newPage();
    await urlPage.goto(url);
    await urlPage.evaluate(() => document.getElementsByTagName('video')[0].pause());
    return urlPage;
}

async function playStream(url) {
    try {
        await stopPlay();
        page = await pages[url];
        await page.evaluate(() => document.getElementsByTagName('video')[0].play());
    } catch (e) {
        console.error(e);
    }
}

function playM3u(path) {
    player.openPlaylist(path);
    player.play();
}

async function stopPlay() {
    player.stop();
    try {
        pages && Object.values(pages).map(async page => {
            await page.evaluate(() => document.getElementsByTagName('video')[0].pause());
        });
    } catch (e) {
        console.error(e);
    }
}

async function setVolume(percentage) {
    if (!percentage) return;
    try {
        await loudness.setVolume(percentage);
    } catch (e) {
        console.error(e);
    }
    // player.volume(volumeMap(percentage));
}

module.exports = {
    playStream,
    playM3u,
    stopPlay,
    setVolume
}
