var Config = require('./config')();
var providersFactory = require('./providers_factory');

const PROVIDERS = ['vk']

function Notifier() {};

Notifier.prototype.call = function call() {
  providerNames = Config.fetchProviders() || PROVIDERS;
  for (var providerName in providerNames) {
    var provider = providersFactory(providerName);
    provider.call();
  }
};

module.exports = Notifier;
