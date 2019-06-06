
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function startRainbow() {
    
    console.log('startedRainbow');

}

function startGradient() {
    
    console.log('startedGradient');

}

function stopRainbow() {
    console.log('stoppedRainbow');
}

function setHexColor(color) {
    const { r, g, b } = hexToRgb(color);
    console.log(`Setting rgb(${r},${g},${b}) from hex ${color}`);
}

function turnOff() {
    console.log('turnedOff');
}

module.exports = {
    startRainbow,
    startGradient,
    setHexColor,
    turnOff
}