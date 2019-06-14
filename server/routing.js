const led = require('./routes/led');
const radio = require('./routes/radio');
const { setModeRoute } = require('./routes/setMode');

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
}
