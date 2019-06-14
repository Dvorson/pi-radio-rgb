const tinycolor = require('tinycolor2');
const tinygradient = require('tinygradient');

const { setRGB } = require('./pigpio');

let rainbowInterval;
let gradientInterval;

function hexToRgb(hex) {
    const color = tinycolor(hex);
    return color.toRgb();
}

function setHexColor(color) {
    const { r, g, b } = hexToRgb(color);
    stopRainbow();
    stopGradient();
    setRGB({ r, g, b });
}

function turnOff() {
    stopRainbow();
    stopGradient();
    setRGB({ r: 0, g: 0, b: 0 });
}

function startRainbow() {
    
    stopGradient();
    stopRainbow();
    let currentColor = tinycolor.random();
    let dir = 1;

    rainbowInterval = setInterval(() => {

        currentColor = currentColor.spin(dir);
        const { r, g, b } = currentColor.toRgb();
        setRGB({ r, g, b });

    }, 25);

}

function startGradient(colors) {

    stopRainbow();
    stopGradient();
    const gradient = tinygradient(colors);
    let currentPhase = .01;
    let dir = .01;

    gradientInterval = setInterval(() => {
        const { r, g, b } = gradient.rgbAt(currentPhase).toRgb();
        setRGB({ r, g, b });
        if (currentPhase === 1 || currentPhase === 0) {
            dir = -dir;
        }
        currentPhase = parseFloat((currentPhase + dir).toFixed(2));
    }, 50);

}

function stopRainbow() {
    rainbowInterval && clearInterval(rainbowInterval);
}

function stopGradient() {
    gradientInterval && clearInterval(gradientInterval);
}

module.exports = {
    startRainbow,
    startGradient,
    setHexColor,
    turnOff
}