const path = require('path');
const extend = require('util')._extend;

const development = require('./env/DEV');
const production = require('./env/PROD');

const defaults = {
  SERVER_ROOT: path.resolve(__dirname, '../'),
  NODE_ENV: process.env.NODE_ENV
};

const appConfig = {
  development: extend(development, defaults),
  production: extend(production, defaults)
};

module.exports = appConfig[(process.env.NODE_ENV || 'development')];
