const core = require('../')
const fs = require('fs');

let subscription = JSON.parse(fs.readFileSync("channel.subscription.json"));

let svcIota = new core.services.iota("https://cvnode.codeworx.de:443");
let svcChannel = new core.services.channel(svcIota.iota);

svcChannel.Messages.subscribe(msg => {
  console.log(msg);
  fs.writeFileSync("channel.subscription.json", JSON.stringify(msg.subscription, null, "  "))
});

svcChannel.subscribe(subscription)
