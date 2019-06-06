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
    startGradient();
    setRGB({ r: 0, g: 0, b: 0 });
}

function startRainbow() {
    
    stopGradient();
    const startColor = tinycolor.random();
    let dir = .01;
    let spinAngle = 0;

    rainbowInterval = setInterval(() => {

        console.log({ spinAngle, dir });
        const { r, g, b } = startColor.spin(spinAngle).toRgb();
        setRGB({ r, g, b });
        if (spinAngle === 360 || spinAngle === 0) {
            dir = -dir;
        }
        spinAngle = parseFloat((spinAngle + dir).toPrecision(3));

    }, 10);

}

function startGradient(colors) {

    stopRainbow();
    const gradient = tinygradient(colors);
    let currentPhase = .01;
    let dir = .01;

    gradientInterval = setInterval(() => {
        console.log({ currentPhase });
        const { r, g, b } = gradient.rgbAt(currentPhase);
        setRGB({ r, g, b });
        if (currentPhase === 1 || currentPhase === 0) {
            dir = -dir;
        }
        currentPhase = parseFloat((currentPhase + dir).toPrecision(3));
    }, 10);

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