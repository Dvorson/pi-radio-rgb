const os = require('os');

module.exports = (os.arch() === 'arm') ? require('./pigpio') : require('./dummy');
