/* eslint-disable */

var mongoose = require(`mongoose`);

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://localhost:27017/NoName`, { useMongoClient: true });

module.exports = {
    mongoose
};