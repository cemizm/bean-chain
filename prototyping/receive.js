const IotaClient = require('./IotaClient.js')
const SEED = "GFCQLPHQXGILVNLU9ZHFGPNPLFAFJJTVJJY9HUYSQFPAWIPDEKZ9EUSZUTSPHF9BDSSFZPBUGXJODYTOP"

var iota = new IotaClient(SEED, {
    host: 'https://cvnode.codeworx.de',
    port: 443
});

function sleep(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, x)
  });
}

async function receive(){
  while(true) {
    var address = await iota.getNewAddress({
      checksum: true
    });
    var transaction = null;
    address = "FTJXQPMDRZFMDMHRCQ9BOQBVKPMIKFB99BZXCQGUNBUUX9QLNVCHTZYOHFZPRFNVHVUORTEIKITZOQYICTREPIVSCD"
    console.log(address);

    while(transaction == null) {
      var transactions = await iota.findTransactionObjects({ addresses: [address] });

      if(transactions.length > 0){
        transaction = transactions[0]

        transactions.sort((a,b)=>{
          if(a.currentIndex < b.currentIndex)
            return -1;

          if(a.currentIndex > b.currentIndex)
            return 1;

          return 0;
        });

        message = "";
        transactions.forEach(t => { message += t.signatureMessageFragment })
        
        console.log(transaction.value);
        console.log(iota.utils.fromTrytes(message.replace(/9*$/, '')));
      }
      else
        await sleep(5000);
    }

  }
}

receive();
