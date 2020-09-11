const puppeteer = require('puppeteer');
const MPlayer = require('mplayer');
const loudness = require('loudness');
const Promise = require('bluebird');
const os = require('os');

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

preloadPages();

async function preloadPages() {
    if (!browser) browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--mute-audio'],
        ...(os.platform() === 'linux' && { executablePath: 'chromium-browser', args: ['--no-sandbox'] })
    });
    const stations = await getLocalStations();
    const streamUrls = stations.map(({ streamUrls }) => streamUrls[0].streamUrl);
    pages = await Promise.reduce(streamUrls, async (acc, url) => ({ ...acc, [url]: await preload(url) }), {});
}

async function preload(url) {
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
}

module.exports = {
    playStream,
    playM3u,
    stopPlay,
    setVolume
}
