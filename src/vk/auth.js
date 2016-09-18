require('dotenv').config();
var qs = require('qs');

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

module.exports = function() {
  var uri =  process.env.VK_CLIENT_OAUTH +
             '?client_id=' +
             process.env.VK_CLIENT_ID +
             '&v=' +
             process.env.VK_API_VERSION +
             '&' +
             'response_type=token&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,messages,offline&state=notify_me'

  var Auth = {};

  Auth.login = function login(callback) {
    var authWindow = new BrowserWindow({
        frame: false,
        height: 500,
        resizable: false,
        width: 750
    });

    authWindow.loadURL(uri);

    authWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl, isMainFrame) {
      if(newUrl.match(/access_token=/) != null && newUrl.match(/user_id=/) != null) {
        var response = qs.parse(newUrl.match(/(access_token=(.*))/)[1]);
        callback(null, {
          token: response.access_token,
          user_id: response.user_id
        });
        return authWindow.close();
      }
      return false;
    });
  }

  return Auth;
}
