const path = require('path');

const { playM3u } = require('../../lib/playAudio');
const { startGradient } = require('../../lib/led'); 

const resolvePath = (mode) => path.resolve(`server/static/sounds/${mode}.m3u`);

const colorMap = {
    africa: ['yellow', 'green', 'orange'],
    desert: ['red', 'yellow', 'purple'],
    forest: ['green', 'yellow', 'orange'],
    ocean: ['blue', 'turquoise', 'lightblue']
}

async function setModeRoute(req, res) {
    const { mode } = req.params;
    startGradient(colorMap[mode]);
    playM3u(resolvePath(mode));
    res.status(200).send('OK');
}

module.exports = {
    setModeRoute
}
