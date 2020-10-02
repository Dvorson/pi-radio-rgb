const axios = require('axios');
const lame = require('lame');
const Speaker = require('speaker');
const loudness = require('loudness');
const m3u8 = require('m3u8');
const fs = require('fs');

const { defaultVolume } = require('../config');
const { getLocalStations } = require('./external/radio.net');
const logger = require('../server/logger');

const BASE_VOLUME = 50;

// loudness.setVolume(BASE_VOLUME + defaultVolume / 2);

const loadedStreams = {};
const m3uParser = m3u8.createStream();

async function playStream(url) {
  try {
    await stopPlay();
    if (!loadedStreams[url]) {
      loadedStreams[url] = {};
      const { data } = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        timeout: 1000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
        }
      });
      loadedStreams[url].stream = data;
    }
    loadedStreams[url].stream.pipe(new lame.Decoder())
      .on('format', function (format) {
        if (!loadedStreams[url].speaker) {
          loadedStreams[url].speaker = new Speaker(format)
        }
        this.pipe(loadedStreams[url].speaker);
      });
  } catch (e) {
    console.error(e)
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

async function stopPlay() {
  Object.entries(loadedStreams).map(([key, { stream, speaker }]) => {
    speaker && speaker.end();
    stream && stream.unpipe();
    loadedStreams[key] = null;
  });
}

function playM3u(path) {
  const file = fs.createReadStream(path);
  file.pipe(m3uParser);
  m3uParser.on('item', item => console.log({ item }));
  m3uParser.on('m3u', m3u => console.log({ m3u }));
}

module.exports = {
  playStream,
  playM3u,
  stopPlay,
  setVolume
}