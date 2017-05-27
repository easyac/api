const debug = require('debug')('easyacapi');
const UserModel = require('../../models/user');
const queue = require('../../config/queue');

const SIX_HOURS = 1000 * 60 * 6;

function enqueueJob(user) {
  const { username, password, unity } = user.senacCredentials;
  queue.create('worker:login', { username, password, unity })
    .ttl(SIX_HOURS)
    .priority('high')
    .save((err) => {
      if (err) debug(err);
      debug('JOB %s for %s sent', 'worker:login', username);
    });
}

module.exports = (job, done) => {
  const query = {
    'senacCredentials.storePassword': true,
    'senacCredentials.isSyncing': false,
  };

  UserModel.find(query, (err, users) => {
    if (err) debug(err);
    else {
      debug('Found %s user(s) to sync', users.length);
      users.map(enqueueJob);
    }
    done();
  });
};
