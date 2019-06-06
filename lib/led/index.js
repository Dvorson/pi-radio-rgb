const os = require('os');

module.exports = (os.arch() === 'arm') ? require('./colorManager') : require('./dummy');
