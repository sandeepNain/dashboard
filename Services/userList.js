const model = require('./../Model');

var getUserList = (criteria, projection, options, callback) => {
    options.lean = true;
    model.users.find(criteria, projection, options, callback);
}

var addUsersList = (obj, callback) => {
    new model.users(obj).save(callback);
}

var updateUsersList = (criteria, projection, options, callback) => {
    options.lean = true;
    options.upsert = true;
    model.users.update(criteria, projection, options, callback);
}

module.exports  =   {
    getUserList, addUsersList, updateUsersList,
}