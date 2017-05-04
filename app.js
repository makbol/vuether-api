const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use('/', require('./routes'));

module.exports = app;
