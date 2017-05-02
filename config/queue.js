const kue = require('kue');
const REDIS = require('./index').redis;

const config = {
  host: REDIS.HOST,
  port: REDIS.PORT,
};

module.exports = kue.createQueue(config);
