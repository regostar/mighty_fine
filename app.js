//sets up express and mounts the routes - REST

const express = require('express');
const usageRouter = require('./routes/usage');

const app = express();

// Mount the usage route
app.use('/usage', usageRouter);

module.exports = app;
