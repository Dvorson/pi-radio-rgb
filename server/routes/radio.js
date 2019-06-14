
const { getLocalStations, updateStations } = require('../../lib/external/radio.net');
const { playStream, stopPlay, setVolume } = require('../../lib/playAudio');

async function getLocalStationsRoute(req, res) {
    return res.json(await getLocalStations());
}

async function updateStationsRoute(req, res) {
    await updateStations();
    return res.json(await getLocalStations());
}

function playStreamRoute(req, res) {
    const { streamUrl } = req.body;
    playStream(streamUrl);
    res.status(200).send('OK');
}

function stopPlayRoute(req, res) {
    stopPlay();
    return res.status(200).send('OK');
}

function setVolumeRoute(req, res) {
    const { volume } = req.query;
    setVolume(volume);
    return res.status(200).send('OK');
}

module.exports = {
    getLocalStationsRoute,
    updateStationsRoute,
    playStreamRoute,
    stopPlayRoute,
    setVolumeRoute
}
