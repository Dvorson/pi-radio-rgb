const led = require('./routes/led');
const radio = require('./routes/radio');
const { setModeRoute } = require('./routes/setMode');
const { shutdownRoute } = require('./routes/shutdown');

module.exports = function (app) {
    app.get('/api/startRainbow', led.startRainbowRoute);
    app.get('/api/turnOff', led.turnOffRoute);
    app.get('/api/setColor/:hexColor', led.setHexColorRoute);
    app.get('/api/getRadioStations', radio.getLocalStationsRoute);
    app.get('/api/updateRadioStations', radio.updateStationsRoute);
    app.post('/api/playStream', radio.playStreamRoute);
    app.get('/api/stopPlay', radio.stopPlayRoute);
    app.get('/api/setVolume', radio.setVolumeRoute);
    app.get('/api/setMode/:mode', setModeRoute);
    app.get('/api/shutdown', shutdownRoute);
}
