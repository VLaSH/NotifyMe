var Vk = require('./vk');
const electron = require('electron');
var ipcMain = electron.ipcMain;
var Mongo = require('./mongo')();

class Networks {
  constructor(mainWindow) {
    this.mainWindow = mainWindow
  }

  init() {
    var _this = this;
    new Vk(this.mainWindow).init();
    ipcMain.on('providers/fetch', function(data) {
      console.log('Here');
      Mongo.find('networks', {}, function(err, data) {
        _this.mainWindow.webContents.send('providers/fetch/response', data)
      })
    })
  }
}

module.exports = Networks;
