var mongoose = require('mongoose');

// define the schema for our user model
var turmaSchema = mongoose.Schema({
    'username': String
});

// checking if password is valid using bcrypt
turmaSchema.methods.validPassword = function(password) {
    return true;
};


// create the model for users and expose it to our app
module.exports = mongoose.model('Aluno', turmaSchema);
