const NRP = require('node-redis-pubsub');

const config = {
  host: 'localhost',
  port  : 6379,
  scope : 'senac'
};

const nrp = new NRP(config);

module.exports = nrp
