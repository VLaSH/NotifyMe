var Rabbit = require('../../rabbit')();

module.exports = function(message) {
  Rabbit.publish('vk.auth', { message: message });

  return true;
}
