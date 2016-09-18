// var Notifier = require('./src/notifier');
// var not = new Notifier();
// not.call();

require('./src/vk/auth/auth_consumer')();
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const views = '/app/views';
var ipc = electron.ipcRenderer;
var ipcMain = electron.ipcMain;
var mongo = require('./src/mongo')();
var vkAuth = require('./src/vk/auth')();
var Mongo = require('./src/mongo')();
var assert = require('assert');
var authProducer = require('./src/vk/auth/auth_producer');

var mainWindow = null;
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        frame: false,
        height: 700,
        resizable: false,
        width: 700
    });

    mongo.find({}, function(err, data) {
      mainWindow.webContents.send('notifications-list', data)
    })

    mainWindow.loadURL('file://' + __dirname + views + '/index.jade');
});

ipcMain.on('return-notifications', function(data) {
  mongo.find({}, function(err, data) {
    console.log('alalal');
    mainWindow.webContents.send('notifications-list', data)
  })
})
ipcMain.on('login', function(data) {
  vkAuth.login(function(err, data) {
    data.window_id = mainWindow.id
    authProducer(data)
  });
})
