var Message = require('./message')
var Friends = require('./friends')

module.exports = function(notifType) {
  switch (notifType) {
    case 'message':
      return new Message();
      break;
    case 'friends':
      return new Friends();
      break;
    default:
      return new Message();
  }
}
