const IotaClient = require('./IotaClient.js')
const SEED = "GFCQLPHQXGILVNLU9ZHFGPNPLFAFJJTVJJY9HUYSQFPAWIPDEKZ9EUSZUTSPHF9BDSSFZPBUGXJODYTOP"

var iota = new IotaClient(SEED, {
    host: 'https://cvnode.codeworx.de',
    port: 443
});

async function send(){
  var accoundData = await iota.getAccountData(SEED);

  console.log(accoundData);

  var transfers = [{
    address: 'RCHMNBCRLXIW9LKUCCLKBNGPIEABEWDAVKKLJDGGKIJOFGAQMJPA9IZOIHXOYAHLAXTGPEFDRT9YCAZSXQPVDBFDZD',
    value: 0,
    message: iota.utils.toTrytes("Blublub")}
  ];

  let response = await iota.sendTransfer(transfers);

  console.log(response);
}

send();
