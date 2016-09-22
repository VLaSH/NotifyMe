var Rabbit = require('../rabbit'),
    rabbit = new Rabbit();
var Mongo = require('../mongo')();
var assert = require('assert');

function Friends() {
  rabbit.subscribe('vk.friends', function(message) {
    console.log(message);
  });
};

Friends.prototype.call = function call() {
  this.publish('Here');
};

Friends.prototype.publish = function publish(message) {
  rabbit.publish('vk.friends', { message: message });
};

module.exports = Friends;
