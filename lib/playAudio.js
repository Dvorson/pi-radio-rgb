const { spawn } = require('child_process');

let childProcess;

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => 
    process.on(eventType, async () => {
        await stopPlay();
        process.exit();
    })
);

async function playStream(url) {
    await stopPlay();
    childProcess = spawn('mplayer', [url], {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit"
      });
}

async function playM3u(path) {
    await stopPlay();
    childProcess = spawn('mplayer', ["-playlist", path], {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit"
      });
}

async function stopPlay() {
    return new Promise((resolve, reject) => {
        if (!childProcess) return resolve();
        childProcess.on('exit', resolve);
        [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => 
            childProcess.on(eventType, resolve)
        );
        childProcess.kill();
    });
}

module.exports = {
    playStream,
    playM3u,
    stopPlay
}
