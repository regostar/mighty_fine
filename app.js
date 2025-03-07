//sets up express and mounts the routes - REST

const express = require('express');
const usageRouter = require('./routes/usage');

const app = express();

// Use JSON middleware
app.use(express.json());

// Mount REST routes
app.use('/usage', usageRouter);

module.exports = app;
