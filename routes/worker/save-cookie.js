const debug = require('debug')('easyacapi');
const UserModel = require('../../models/user');

module.exports = (job, done) => {
  const { data } = job;
  const query = { 'senacCredentials.username': data.username };
  const update = {
    $set: {
      'senacCredentials.cookie': data.cookie,
    },
  };

  UserModel.findOneAndUpdate(query, update, (err) => {
    if (err) debug(err);
    else debug(`Saved cookie for ${data.username}`);
    done();
  });
};
