var Vk = require('./vk');

class Networks {
  constructor(mainWindow) {
    this.mainWindow = mainWindow
  }

  init() {
    new Vk(this.mainWindow).init();
  }
}

module.exports = Networks;
