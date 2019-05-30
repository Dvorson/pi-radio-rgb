
const { getLocalStations } = require('../../lib/external/radio.net');

async function getLocalStationsRoute(req, res) {
    return res.json(await getLocalStations());
}

module.exports = {
    getLocalStationsRoute
}
