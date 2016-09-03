var Rabbit = require('../../rabbit')();

module.exports = function() {
  Rabbit.subscribe('vk.message', function(message) {
    console.log(message);
  });

  return true;
}
