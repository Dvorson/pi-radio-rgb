const request = require('request');
const lame = require('lame');
const Speaker = require('speaker');

const audioOptions = {
    channels: 2,
    bitDepth: 16,
    mode: lame.STEREO
};

const decoder = new lame.Decoder();
let speaker = new Speaker(audioOptions);

async function playStream(url) {
    stopPlay();
    return new Promise((resolve, reject) => {
        request.get(url)
            .on('response', function(res) {
                res.pipe(decoder)
                    .once('format', () => {
                        speaker = new Speaker(audioOptions);
                        stream = decoder.pipe(speaker)
                            .on('error', console.log);
                        resolve();
                    })
                    .on('error', console.log);
            })
            .on('error', console.log);
    });
}

function stopPlay() {
    speaker.removeAllListeners('close');
    speaker.end();
    return;
}

module.exports = {
    playStream,
    stopPlay
}
