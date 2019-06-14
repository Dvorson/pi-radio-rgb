const { spawn } = require('child_process');

function shutdown() {
    spawn('shutdown now');
}

module.exports = {
    shutdown
}