const UserModel = require('../../models/user');
const NRP = require('../../config/nrp');
const debug = require('debug')('api:worker');

NRP.on('api:save-cookie', (data) => {
  const query = { 'senacCredentials.username': data.username };
  const update = {
    $set: {
      'senacCredentials.cookie': data.cookie,
    },
  };

  UserModel.update(query, update, (err) => {
    if (err) debug(err);
    else debug(`Saved cookie for ${data.username}`);
  });
});

NRP.on('api:save-classes', (data) => {
  debug(JSON.stringify(data));
});
