require('dotenv').config();
var qs = require('qs');
var Rabbit = require('../rabbit'),
    rabbit = new Rabbit();
var Mongo = require('../mongo')();
var assert = require('assert');
var Notifier = require('./notifier'),
    notifier = new Notifier();

const electron = require('electron');
const session = electron.session;
const BrowserWindow = electron.BrowserWindow;

class Auth {
  constructor() {
    this.uri = process.env.VK_CLIENT_OAUTH +
               '?client_id=' +
               process.env.VK_CLIENT_ID +
               '&v=' +
               process.env.VK_API_VERSION +
               '&' +
               'response_type=token&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,messages,offline&state=notify_me'

    // Init consumer
    rabbit.subscribe('vk.auth', function(data) {
      Mongo.connection(function(db) {
        var collection = db.collection('networks');
        var fields = {
          user_id: data.message.user_id,
          token: data.message.token,
          provider: 'vk'
        };
        // collection.createIndex({ provider: 1 }, { unique: true });
        collection.insert(fields, { ordered: false }, function(err, result) {
          if(err) {
            return false;
          }
          assert.equal(err, null);
          session.defaultSession.cookies.set({ url: 'http://localhost', name: 'user_id', value: data.message.user_id }, function(err) {
            if(err) {
              return new err;
            }
          });
          var mainWindow = BrowserWindow.fromId(data.message.window_id);
          mainWindow.webContents.send('vk/auth/login/response');
          db.close();
        });

        notifier.fetch();
      });
    });

  }

  login(callback) {
    var authWindow = new BrowserWindow({
        frame: false,
        height: 500,
        resizable: false,
        width: 750
    });

    authWindow.loadURL(this.uri);

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

  publish(message) {
    rabbit.publish('vk.auth', { message: message });
  }


}

module.exports = Auth;
