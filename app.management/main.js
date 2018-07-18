const { app, BrowserWindow, ipcMain } = require('electron');

var win;

function createWindow () {
  console.log("createWindow")

  let cfg = {
    kiosk:false,
    width: 800,
    height: 480
  }

  win = new BrowserWindow(cfg)

  win.loadURL(`file://${__dirname}/dist/managment/index.html`)

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('getAddress', async (event, arg) =>{
  event.sender.send("address", controller.address);
});
