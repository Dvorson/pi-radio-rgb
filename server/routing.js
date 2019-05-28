const led = require("./routes/led");

module.exports = function (app) {
    app.get("/api/startRainbow", led.startRainbowRoute);
    app.get("/api/turnOff", led.turnOffRoute);
    app.get("/api/setColor/:hexColor", led.setHexColorRoute);
}
