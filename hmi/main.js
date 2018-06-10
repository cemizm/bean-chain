const { app, BrowserWindow, ipcMain } = require('electron')

const SEED = "L9TIGNCGZUMZAKOHAVUZIIDBAYPFYEKCIIZMVPJGEUOEEWFEEERWBHWYWLLMDSXBUKIUG9ZKMY9GR9DXB";

const core = require('bc-core');

let svcIota = new core.services.iota("https://cvnode.codeworx.de:443");

let win;
let address;

function createWindow () {
  win = new BrowserWindow({
    kiosk:false,
    width: 800,
    height: 480
  })

  win.loadURL(`file://${__dirname}/dist/hmi/index.html`)

  win.on('closed', function () {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('getAddress', async (event, arg) =>{
  event.sender.send("address", address);
});

async function init(){
  address = await svcIota.getNewAddress(SEED, { checksum: true });
  if(win)
    win.webContents.send("address", address);

  setInterval(async () => {
    var transactions = await svcIota.findTransactionObjects({ addresses: [address] });
    if(transactions.length > 0){
      transaction = transactions[0]

      // check value and send message to analytics channel..

      address = await svcIota.getNewAddress(SEED, { checksum: true });
      if(win)
        win.webContents.send("address", address);
    }
  }, 5000);
}

init();
