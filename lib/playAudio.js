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
const pagesPreloaded = preloadPages();

async function preloadPages() {
    if (!browser) browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--mute-audio'],
        ...(os.platform() === 'linux' && { executablePath: 'chromium-browser', args: ['--no-sandbox'] })
    });
    const stations = await getLocalStations();
    const streamUrls = stations.map(({ streamUrls }) => streamUrls[0].streamUrl);
    pages = await Promise.reduce(streamUrls, async (acc, url) => ({ ...acc, [url]: await preload(url) }), {});
    if (!pages || !Object.values(pages).length) await preloadPages();
    return pages;
}

async function preload(url, count = 5) {
    try {
        const urlPage = await browser.newPage();
        await urlPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        const resp = await urlPage.goto(url);
        if (count === 0) return urlPage;
        if (resp.status() >= 400) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return preload(url, count--);
        }
        await urlPage.evaluate(() => document.getElementsByTagName('video')[0].pause());
        return urlPage;
    } catch (e) {
        console.error(e);
        return preload(url, count--);
    }
}

async function playStream(url) {
    try {
        await pagesPreloaded;
        await stopPlay();
        page = await pages[url];
        page && await page.evaluate(() => document.getElementsByTagName('video')[0].play());
    } catch (e) {
        console.error(e);
    }
}

function playM3u(path) {
    stopPlay();
    player.openPlaylist(path);
    player.play();
}

async function stopPlay() {
    player.stop();
    try {
        pages && Object.values(pages).map(async page => {
            await page && page.evaluate(() => document.getElementsByTagName('video')[0].pause());
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
