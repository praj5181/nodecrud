const express = require('express');

const app = express();

const userRoute = require('./api/routes/routes');

app.use(express.json());

app.use("/", userRoute);

module.exports = app;