const MPlayer = require('mplayer');

const player = new MPlayer();

player.on('status', (status) => console.log({status}));

function playStream(url) {
    player.openFile(url);
}

function playM3u(path) {
    player.openPlaylist(path);
    player.play();
}

function stopPlay() {
    player.stop();
}

module.exports = {
    playStream,
    playM3u,
    stopPlay
}
