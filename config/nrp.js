const NRP = require('node-redis-pubsub');
const REDIS = require('./index').redis;

const config = {
  host: REDIS.HOST,
  port: REDIS.PORT,
  scope: 'senac',
};

const nrp = new NRP(config);

module.exports = nrp;
