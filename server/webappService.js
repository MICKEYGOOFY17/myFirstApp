const path = require('path');

const service = require('./service');

function setupWebAppRESTRoutes(app) {
  app.use('/', require(path.join(__dirname, './users')));
  return app;
}

// App Constructor function is exported
module.exports = function() {
  let app = service.createApp();

  app = service.setupWebpack(app);

  app = service.setupStaticRoutes(app);

  app = service.setupMiddlewares(app);

  app = service.setupAppRoutes(app);

  app = service.setupRestRoutes(app);

  app = service.setupMongooseConnections(app);

  return app;
};
