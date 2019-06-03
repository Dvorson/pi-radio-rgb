const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const routes = require('./routing');

const app = express();

app.use('/static', express.static(path.resolve(__dirname, 'static')));
app.use('/build', express.static(path.resolve(__dirname, '../build')));
app.use(bodyParser.json());
routes(app);

// This is fired every time the server-side receives a request.
app.use((req, res) => res.sendFile(path.resolve(__dirname, 'views/index.html')));

module.exports = app;
