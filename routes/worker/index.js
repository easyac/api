const UserModel = require('../../models/user');
const NRP = require('../../config/nrp');

NRP.on('api:save-cookie', data => {
  const query = {"senacCredentials.username": data.username};
  const update = {
    "$set":{
      "senacCredentials.cookie": data.cookie
    }
  };

  UserModel.update(query, update, (err, d) => {
    console.log(err, d);
  })
});

NRP.on('api:save-classes', data => {
  console.log(data);
});
