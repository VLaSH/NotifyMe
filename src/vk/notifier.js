const NOTIFICATION_TYPES = ['message', 'friends']
var Config = require('../config')();
var notifTypesFactory = require('./notification_types_factory');
var Mongo = require('../mongo')();
var Rabbit = require('../rabbit'),
    rabbit = new Rabbit();

class Notifier {
  constructor() {
    rabbit.subscribe('vk.fetch', function(data) {
      var notifTypeNames = Config.fetchNotifTypes() || NOTIFICATION_TYPES;
      Mongo.find('networks', { provider: 'vk' }, function(err, data) {
        if(err) {
          return new err;
        } else {
          for (let notifTypeName of notifTypeNames) {
            var notifType = notifTypesFactory(notifTypeName);
            notifType.call(data[0].token);
          }
        }
      })
    });
  }

  fetch() {
    rabbit.publish('vk.fetch', {});
  }
}

module.exports = Notifier;
