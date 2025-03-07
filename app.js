//sets up express and mounts the routes - REST

const express = require('express');
const usageRouter = require('./routes/usage');
const clientsRouter = require('./routes/clients'); 

const app = express();

// Use JSON middleware
app.use(express.json());

// Mount REST routes
app.use('/usage', usageRouter);
app.use('/clients', clientsRouter); 

module.exports = app;
