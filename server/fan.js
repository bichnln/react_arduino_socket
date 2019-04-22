/* eslint-disable */
var mongoose = require('mongoose');

// create model - Todo model. - mongoose model
// this pre-defines the collection.
var Fan = mongoose.model(`Fan`, {
    status: {
      type: String,
      default: false
    },
    temp: {
      type: String,
      default: false
    }
});

module.exports = {
    Fan
};