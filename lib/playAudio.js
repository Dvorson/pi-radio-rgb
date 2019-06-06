const { spawn } = require('child_process');

let childProcess;

async function playStream(url) {
    stopPlay();
    childProcess = spawn('mplayer', [url], {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit"
      });
    
    process.on('exit', () => childProcess.kill())
}

async function stopPlay() {
    return new Promise((resolve, reject) => {
        if (!childProcess) return resolve();
        childProcess.on('exit', resolve);
        childProcess.kill();
    });
}

module.exports = {
    playStream,
    stopPlay
}
