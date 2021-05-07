'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const logger = require('winston');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(require('./routes/index.routes'));

const listener = app.listen(process.env.PORT, () =>
    logger.info(`Keyword Parser is listening on port ${listener.address().port}`)
);

module.exports = app;
