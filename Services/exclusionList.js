const model = require('./../Model');

var getList = (criteria, projection, options, callback) => {
    options.lean = true;
    model.exclusion.find(criteria, projection, options, callback);
}

var addList = (obj, callback) => {
    new model.exclusion(obj).save(callback);
}

var insertMany = (array, options, callback) => {
    options.ordered = true;
    model.exclusion.insertMany(array, options, callback);
}

var updateList = (criteria, projection, options, callback) => {
    options.lean = true;
    options.upsert = true;
    model.exclusion.update(criteria, projection, options, callback);
}

var delteMany = (criteria, options, callback) => {
    options.lean = true;
    options.upsert = true;
    model.exclusion.deleteMany(criteria, options, callback);
}

var deleteOne = (criteria, options, callback) => {
    options.lean = true;
    options.upsert = true;
    model.exclusion.deleteOne(criteria, options, callback);
}

module.exports  =   {
    getList, addList, insertMany, updateList,
    delteMany, deleteOne,
}