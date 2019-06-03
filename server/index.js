const express = require('express');
const path = require('path');

const routes = require('./routing');

const app = express();

app.use('/static', express.static('./server/static'));
app.use('/build', express.static('./build'));
routes(app);

// This is fired every time the server-side receives a request.
app.use((req, res) => res.sendFile(path.resolve(__dirname, 'views/index.html')));

module.exports = app;
