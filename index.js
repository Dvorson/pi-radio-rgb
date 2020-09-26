const app = require('./server');
const logger = require('./server/logger');
const { port } = require('./config');

app.listen(port, err => {
    if (err) return logger.error(err);
    logger.info(`Server is listening on port ${port}`);
});
