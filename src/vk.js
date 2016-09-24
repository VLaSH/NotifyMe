const electron = require('electron');
var ipcMain = electron.ipcMain;
var Mongo = require('./mongo')();
var Auth = require('./vk/auth');
var auth = new Auth();
var log = require('winston');



class Vk {
  constructor(mainWindow) {
    this.mainWindow = mainWindow
  }

/**
  # Apply network events.
*/
  init() {
    var _this = this;
    log.info('[VK][Init]: Started');

    ipcMain.on('vk/notifications/fetch_local', function(data) {
      log.info('[VK][Event]: *vk/notifications/fetch_local* Started');

      Mongo.find('notifications', { provider: 'vk', status: 'unread' }, function(err, data) {
        if(err) {
          log.error('[VK][Event]: *vk/notifications/fetch_local* Error ' + err);
          return new err;
        } else {
          console.log(data);
          _this.mainWindow.webContents.send('vk/notifications/fetch_local/response', data);

          log.info('[VK][Event]: *vk/notifications/fetch_local* Completed');
        }
      });
    });

    ipcMain.on('vk/auth/login', function(data) {
      log.info('[VK][Event]: *vk/auth/login* Started');

      auth.login(function(err, data) {
        if(err) {
          log.error('[VK][Event]: *vk/auth/login* Error ' + err);
          return new err;
        } else {
          // login to vk account
          data.window_id = _this.mainWindow.id;
          auth.publish(data)

          log.info('[VK][Event]: *vk/auth/login* Completed');
        };
      })
    })

    ipcMain.on('vk/auth/check', function(data) {
      log.info('[VK][Event]: *vk/auth/check* Started');

      Mongo.find('networks', { provider: 'vk' }, function(err, data) {
        if(err) {
          log.info('[VK][Event]: *vk/auth/check* Error ' + err);

          return new err;
        } else {
          _this.mainWindow.webContents.send('vk/auth/check/response', data);

          log.info('[VK][Event]: *vk/auth/check* Completed');
        }
      })
    })

    log.info('[VK][Init]: Completed');
  };
}

module.exports = Vk;
