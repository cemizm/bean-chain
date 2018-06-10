const { app, BrowserWindow, ipcMain } = require('electron')

const SEED = "L9TIGNCGZUMZAKOHAVUZIIDBAYPFYEKCIIZMVPJGEUOEEWFEEERWBHWYWLLMDSXBUKIUG9ZKMY9GR9DXB";

const core = require('bc-core');

let svcIota = new core.services.iota("https://cvnode.codeworx.de:443");

let win;
let address;
let index = 0;

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

async function updateAddress() {
  let addresses = await svcIota.getNewAddress(SEED, { checksum: true, index: index, returnAll:true });
  let temp = addresses.pop();
  if(temp == address)
    return;

  index += addresses.length + 1;
  address = temp;

  if(win)
    win.webContents.send("address", address);

  console.log("new address:" + address);
}

async function getTransactions() {
  var transactions = await svcIota.findTransactionObjects({ addresses: [address] });
  if(transactions.length > 0){
    transaction = transactions[0]
    console.log("new tx:" + transaction.value);
    // check value and send message to analytics channel..

    await updateAddress();
  }
  setTimeout(getTransactions, 5000);
}

async function init(){
  await updateAddress();
  await getTransactions();
}

init();
