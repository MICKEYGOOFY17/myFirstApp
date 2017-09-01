let mongo = {
  host: process.env.MONGO_HOST || '127.0.0.1',
  port: process.env.MONGO_PORT || 27017,
  usr: process.env.MONGO_USR || 'mongo',
  pwd: process.env.MONGO_PWD || 'mongo',
  masterDB: process.env.MONGO_DB || 'restaurants'
};

//@ TODO use mongo username & password in constructing the URL if given
mongo['mongoURL'] = ('mongodb://' + mongo.host + ':' + mongo.port + '/' + mongo.masterDB);

let config = {
  MONGO: mongo
}

module.exports = config;
