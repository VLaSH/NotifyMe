// var Notifier = require('./src/notifier');
// var not = new Notifier();
// not.call();

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const views = '/app/views';
var Networks = require('./src/networks');

var mainWindow = null;
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        frame: false,
        height: 300,
        resizable: false,
        width: 250
    });
    mainWindow.webContents.openDevTools({ mode: 'detach' })
    var networks = new Networks(mainWindow);
    networks.init();
    mainWindow.loadURL('file://' + __dirname + views + '/index.jade');
});
