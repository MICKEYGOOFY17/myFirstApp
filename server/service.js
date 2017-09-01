const express = require('express');
var path = require('path');
const mongoose = require('mongoose');
const CONFIG = require('../config');

// new express app
function createApp() {
  var app = express();
  return app;
}

function setupStaticRoutes(app) {
  app.use(express.static(path.resolve(__dirname, '../', 'client')));
  return app;
}

function setupMiddlewares(app) {
  const bodyParser = require('body-parser');
  app.use(bodyParser());
  return app;
}

function setupWebpack(app) {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config.js');
  const webpackCompiler = webpack(webpackConfig);
  app.use(webpackHotMiddleware(webpackCompiler));
  app.use(webpackDevMiddleware(webpackCompiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      stats: {colors: true}
  }));
  return app;
}

function setupRestRoutes(app) {
  app.use('/users', require(path.join(__dirname, './users')));
  return app;
}

 function setupMongooseConnections(app) {
   mongoose.connect(CONFIG.MONGO.mongoURL);
   mongoose.connection.on('connected', function() {
    console.log('Mongoose is now connected');
  });

  mongoose.connection.on('error', function(err) {
    console.log('Error in Mongoose connection: ', err);
  });

  mongoose.connection.on('disconnected', function() {
    console.log('Mongoose is now disconnected..!');
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log(
        'Mongoose disconnected on process termination'
        );
      process.exit(0);
    });
  });
  return app;
 }

// App Constructor function is exported
module.exports = {
  createApp: createApp,
  setupStaticRoutes: setupStaticRoutes,
  setupRestRoutes: setupRestRoutes,
  setupMiddlewares: setupMiddlewares,
  setupWebpack: setupWebpack,
  setupMongooseConnections: setupMongooseConnections
};
