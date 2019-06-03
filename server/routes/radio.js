
const { getLocalStations } = require('../../lib/external/radio.net');
const { playStream, stopPlay } = require('../../lib/playAudio');

async function getLocalStationsRoute(req, res) {
    return res.json(await getLocalStations());
}

async function playStreamRoute(req, res) {
    const { streamUrl } = req.body;
    await playStream(streamUrl);
    res.status(200).send('OK');
}

function stopPlayRoute(req, res) {
    stopPlay();
    return res.status(200).send('OK');
}

module.exports = {
    getLocalStationsRoute,
    playStreamRoute,
    stopPlayRoute
}
