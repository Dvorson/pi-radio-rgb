const Gpio = require('pigpio').Gpio;

const pins = {
    red: new Gpio(17, {mode: Gpio.OUTPUT}),
    green: new Gpio(27, {mode: Gpio.OUTPUT}),
    blue: new Gpio(22, {mode: Gpio.OUTPUT})
}

function setRGB({ r = 0, g = 0, b = 0 }) {
    const { red, green, blue } = pins;
    red.pwmWrite(r);
    green.pwmWrite(g);
    blue.pwmWrite(b);
}

module.exports = {
    setRGB
}