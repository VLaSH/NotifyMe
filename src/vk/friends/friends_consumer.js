var Rabbit = require('../../rabbit')();

module.exports = function() {
  Rabbit.subscribe('vk.friends', function(message) {
    console.log(message);
  });

  return true;
}
