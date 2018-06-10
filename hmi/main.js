const { app, BrowserWindow, ipcMain } = require('electron');
const Splashscreen = require('@trodi/electron-splashscreen');
const PaymentController = require('./backend/payment.controller');

let controller = new PaymentController("L9TIGNCGU9MZAKOHAVUZIIDBAYPFYEKCIIZMVPJGEUOEEWFEEERWBHWYWLLMDSXBUKIUG9ZKMY9GR9DXB", "https://cvnode.codeworx.de:443");

let cfg = {
  kiosk:false,
  width: 800,
  height: 480
};

var win;

function initialize() {
  const config = {
    windowOpts: cfg,
    templateUrl: `${__dirname}/splash-screen.html`,
    splashScreenOpts: {
        width: 300,
        height: 300,
        transparent: true,
    },
  };
  win = Splashscreen.initSplashScreen(config);
}

function initMain(){
  console.log("initMain")
  win.loadURL(`file://${__dirname}/dist/hmi/index.html`)
  win.on('closed', function () {
    win = null
  })
}

function createWindow () {
  console.log("createWindow")
  cfg.show=true;
  win = new BrowserWindow(cfg)
  initMain();
}

app.on('ready', async () => {
  console.log("ready")
  initialize();
  await controller.initialize();
  initMain();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  console.log("activate")
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('getAddress', async (event, arg) =>{
  event.sender.send("address", controller.address);
});

controller.addressUpdated.subscribe((address) => {
  if(win)
    win.webContents.send("address", address);

  console.log("new address:" + address);
});
