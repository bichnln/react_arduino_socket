/* eslint-disable */
var mongoose = require('mongoose');

// create model - Todo model. - mongoose model
// this pre-defines the collection.
var Player = mongoose.model(`Player`, {
    name: {
      type: String,
      default: false
    },
    level: {
      type: String,
      default: false
    }
});

module.exports = {
  Player
};