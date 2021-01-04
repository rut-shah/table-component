const express = require('express');
const app = express();
const routerConfig = require('./routes/route-config');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const whitelist = ['http://localhost:4200'];

app.use(bodyParser.json());
app.use(helmet());

app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('404 - Not found'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS']
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.use(routerConfig);

module.exports = app;
