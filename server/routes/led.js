const {
    startRainbow,
    setHexColor,
    turnOff
} = require('../../lib/led');

function startRainbowRoute(req, res) {
    startRainbow();
    res.status(200).send('ok');
}

function setHexColorRoute(req, res) {
    const { hexColor } = req.params;
    setHexColor(hexColor);
    res.status(200).send('ok');
}

function turnOffRoute(req, res) {
    turnOff();
    res.status(200).send('ok');
}

module.exports = {
    startRainbowRoute,
    setHexColorRoute,
    turnOffRoute
}