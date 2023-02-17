const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const routes = require('./setupRoutes')

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
routes.setupRoutes(app);

module.exports = app;
