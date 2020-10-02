const puppeteer = require('puppeteer');
const MPlayer = require('mplayer');
const loudness = require('loudness');
const Promise = require('bluebird');
const os = require('os');

const { defaultVolume } = require('../config');
const { getLocalStations } = require('./external/radio.net');
const logger = require('../server/logger');

const player = new MPlayer({
    verbose: true,
    debug: true,
    args: ['-quiet']
});

const BASE_VOLUME = 50;

player.volume(100);
loudness.setVolume(BASE_VOLUME + defaultVolume / 2);

let page;
let pages;
let browser;
let currentlyPlayingPage;
const pagesPreloaded = preloadPages();

async function preloadPages() {
    try {
        if (!browser) browser = await puppeteer.launch({
            ignoreDefaultArgs: ['--mute-audio'],
            ...(os.platform() === 'linux' && { executablePath: 'chromium-browser', args: ['--no-sandbox', '--disable-extensions'] })
        });
        const stations = await getLocalStations();
        const streamUrls = stations.map(({ streamUrls }) => streamUrls[0].streamUrl);
        pages = await Promise.reduce(streamUrls, async (acc, url) => ({ ...acc, [url]: await preload(url) }), {});
        if (!pages || !Object.values(pages).length) await preloadPages();
        await Promise.map(Object.values(pages), page => 
            page
                .on('console', message =>
                logger.info(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
                .on('pageerror', ({ message }) => logger.error(message))
                .on('response', response =>
                !response.url().includes('data:image') && logger.info(`${response.status()} ${response.url()}`))
                .on('requestfailed', request =>
                logger.error(`${request.failure().errorText} ${request.url()}`))
        );
        return pages;
    } catch (e) {
        logger.error(e);
    } 
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
        logger.error(e);
        return preload(url, count--);
    }
}

async function playStream(url) {
    try {
        await pagesPreloaded;
        await stopPlay();
        page = await pages[url];
        page && await page.evaluate(() =>
            document
                .getElementsByTagName('video')[0]
                .play()
                .catch(console.error)
        );
        currentlyPlayingPage = { url, page }
    } catch (e) {
        logger.error(e);
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
        if (currentlyPlayingPage && !currentlyPlayingPage.page.isClosed()) {
            await currentlyPlayingPage.page.close();
            pages[currentlyPlayingPage.url] = await preload(currentlyPlayingPage.url);
        }
        /* pages && Object.values(pages).map(async page => {
            try {
                await page && page.evaluate(() => document.getElementsByTagName('video')[0].pause());
            } catch (e) {
                logger.error(e);
            }
        }); */
    } catch (e) {
        logger.error(e);
    }
}

async function setVolume(percentage) {
    if (!percentage) return;
    try {
        await loudness.setVolume(BASE_VOLUME + percentage / 2);
    } catch (e) {
        logger.error(e);
    }
}

module.exports = {
    playStream,
    playM3u,
    stopPlay,
    setVolume
}
