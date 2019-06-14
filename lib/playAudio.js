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

function setVolume(percentage) {
    if (!percentage) return;
    player.volume(percentage);
}

module.exports = {
    playStream,
    playM3u,
    stopPlay,
    setVolume
}
