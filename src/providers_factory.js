var Vk = require('./vk')

module.exports = function(providerName) {
  switch (providerName) {
    case 'vk':
      return new Vk();
      break;
    default:
      return new Vk();
  }
}
