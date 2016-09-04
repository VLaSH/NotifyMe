var Config = require('./config')();
var notifTypesFactory = require('./vk/notification_types_factory');
require('./vk/consumers');

const NOTIFICATION_TYPES = ['message', 'friends']

function Vk() {
};

Vk.prototype.call = function call() {
  notifTypeNames = Config.fetchNotifTypes() || NOTIFICATION_TYPES;
  for (let notifTypeName of notifTypeNames) {
    notifType = notifTypesFactory(notifTypeName);
    notifType.call();
  }
};

module.exports = Vk;
