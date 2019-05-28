const Gpio = require('pigpio').Gpio;

const led = new Gpio(17, {mode: Gpio.OUTPUT});

const pins = {
    red: new Gpio(11, {mode: Gpio.OUTPUT}),
    green: new Gpio(13, {mode: Gpio.OUTPUT}),
    blue: new Gpio(15, {mode: Gpio.OUTPUT})
}

let rainbowInterval;

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

        pins.red.pwmWrite(r);
        pins.green.pwmWrite(g);
        pins.blue.pwmWrite(b);

    }, 10);

}

function stopRainbow() {
    clearInterval(rainbowInterval);
}

function setHexColor(color) {
    const { r, g, b } = hexToRgb(color);
    rainbowInterval && stopRainbow();
    pins.red.pwmWrite(r);
    pins.green.pwmWrite(g);
    pins.blue.pwmWrite(b);
}

function turnOff() {
    rainbowInterval && stopRainbow();
    pins.red.pwmWrite(0);
    pins.green.pwmWrite(0);
    pins.blue.pwmWrite(0);
}

module.exports = {
    startRainbow,
    setHexColor,
    turnOff
}