const core = require('../')
const fs = require('fs');

let subscription = JSON.parse(fs.readFileSync("channel.subscription.json"));

let svcIota = new core.services.iota("https://cvnode.codeworx.de:443");
let svcChannel = new core.services.channel(svcIota.iota);

async function getLast() {
  try{
    let resp = await svcChannel.getLast(subscription);
    console.log(resp);
  }catch(err){
    console.log(err);
  }
}

getLast();
