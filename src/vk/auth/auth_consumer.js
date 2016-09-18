var Rabbit = require('../../rabbit')();
var Mongo = require('../../mongo')();
var assert = require('assert');
const electron = require('electron');
const session = electron.session;
const BrowserWindow = electron.BrowserWindow;

module.exports = function() {
  Rabbit.subscribe('vk.auth', function(data) {
    Mongo.connection(function(db) {
      var collection = db.collection('users');
      var fields = { user_id: data.message.user_id, token: data.message.token };
      collection.createIndex({ user_id: 1 }, { unique: true });
      collection.insert(fields, { ordered: false }, function(err, result) {
        if(err) {
          console.log(err.message);
          return false;
        }
        console.log('inserted', err);
        assert.equal(err, null);
        console.log("Inserted user data into users");
        session.defaultSession.cookies.set({ url: 'http://localhost', name: 'user_id', value: data.message.user_id }, function(err) {
          if(err) {
            return new err;
          }
        });
        var mainWindow = BrowserWindow.fromId(data.message.window_id)
        mainWindow.webContents.send('logged-in');
        db.close();
      });
    });
  });

  return true;
}
