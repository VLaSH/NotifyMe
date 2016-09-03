var Rabbit = require('../../rabbit')();

module.exports = function(message) {
  Rabbit.publish('vk.message', { message: message });

  return true;
}
