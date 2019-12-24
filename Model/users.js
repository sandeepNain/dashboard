var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
        userName:  String,
        email: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('users', usersSchema);