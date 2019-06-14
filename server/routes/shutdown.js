const { shutdown } = require('../../lib/shutdown');

function shutdownRoute(req, res) {
    shutdown();
    return res.status(200).send('OK');
}

module.exports = {
    shutdownRoute
}
