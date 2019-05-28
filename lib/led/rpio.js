const rpio = require('rpio');

const pins = {
    red: 11,
    green: 13,
    blue: 15
}

const clockDiv = 8;
const range = 1024;
let rainbowInterval;

Object.values(pins).map(pin => {
    rpio.open(pin, rpio.PWM);
    rpio.pwmSetClockDivider(clockDiv);
    rpio.pwmSetRange(pin, range);
});

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function startRainbow() {
    
    let r = 255;
    let g = 0;
    let b = 0;

    rainbowInterval = setInterval(function() {
        if(r > 0 && b == 0){
          r--;
          g++;
        }
        if(g > 0 && r == 0){
          g--;
          b++;
        }
        if(b > 0 && g == 0){
          r++;
          b--;
        }

        rpio.pwmSetData(pins.red, r);
        rpio.pwmSetData(pins.green, g);
        rpio.pwmSetData(pins.blue, b);

    }, 10);

}

function stopRainbow() {
    clearInterval(rainbowInterval);
}

function setHexColor(color) {
    const { r, g, b } = hexToRgb(color);
    rainbowInterval && stopRainbow();
    rpio.pwmSetData(pins.red, r);
    rpio.pwmSetData(pins.green, g);
    rpio.pwmSetData(pins.blue, b);
}

function turnOff() {
    rainbowInterval && stopRainbow();
    rpio.pwmSetData(pins.red, 0);
    rpio.pwmSetData(pins.green, 0);
    rpio.pwmSetData(pins.blue, 0);
}

module.exports = {
    startRainbow,
    setHexColor,
    turnOff
}