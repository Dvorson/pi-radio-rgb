const led = require("./routes/led");
const radio = require('./routes/radio')

module.exports = function (app) {
    app.get("/api/startRainbow", led.startRainbowRoute);
    app.get("/api/turnOff", led.turnOffRoute);
    app.get("/api/setColor/:hexColor", led.setHexColorRoute);
    app.get("/api/getRadioStations", radio.getLocalStationsRoute);
    app.post("/api/playStream", radio.playStreamRoute);
    app.get("/api/stopPlay", radio.stopPlayRoute);
}
