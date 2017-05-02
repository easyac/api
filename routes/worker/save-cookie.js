const debug = require('debug')('easyacapi');
const UserModel = require('../../models/user');
const queue = require('../../config/queue');

module.exports = (job, done) => {
  const { data } = job;
  const query = { 'senacCredentials.username': data.username };
  const update = {
    $set: {
      'senacCredentials.cookie': data.cookie,
    },
  };

  UserModel.findOneAndUpdate(query, update, (err, user) => {
    if (err) debug(err);
    else debug(`Saved cookie for ${data.username}`);
    if (user.devices.android || user.devices.ios) {
      queue
        .create('worker:notify-sync', { devices: user.devices, status: 'success' })
        .ttl(1000 * 60 * 24)
        .priority('high')
        .save(debug);
    }

    done();
  });
};
