var Rabbit = require('../../rabbit')();

module.exports = function(message) {
  Rabbit.publish('vk.friends', { message: message });

  return true;
}
