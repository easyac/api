const debug = require('debug')('easyacapi');
const UserModel = require('../../models/user');
const queue = require('../../config/queue');

module.exports = (job, done) => {
  const { data } = job;
  const query = { 'senacCredentials.username': data.username };

  function enqueueJob(user) {
    queue
      .create('worker:notify-login', { devices: user.devices })
      .priority('normal')
      .save((err) => {
        if (err) debug(err);
      });
  }

  UserModel.findOne(query, (err, user) => {
    if (!user && err) debug(err);
    else {
      debug(`JOB worker:notify-login for ${data.username}`);
      enqueueJob(user);
    }
    done();
  });
};
