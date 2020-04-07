const MPlayer = require('mplayer');

const player = new MPlayer({
    verbose: true,
    debug: true
});

player.on('status', (status) => console.log({status}));

function mapRange(in_min, in_max, out_min, out_max) {
    return (value) => (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const volumeMap = mapRange(0,100,60,100);

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
    player.volume(volumeMap(percentage));
}

module.exports = {
    playStream,
    playM3u,
    stopPlay,
    setVolume
}
