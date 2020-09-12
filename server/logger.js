const winston = require('winston');

const { colorize: colorizer, combine } = winston.format;
const { colorize } = colorizer();

const logger = winston.createLogger({
    level: 'debug',
    format: combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf(msg => 
          colorize(msg.level, `${msg.level}: ${msg.message}`)
        )
      ),
    transports: [
        new winston.transports.Console({})
    ],
});

module.exports = logger;
