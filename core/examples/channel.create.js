const core = require('../')
const fs = require('fs');

let svcIota = new core.services.iota("https://cvnode.codeworx.de:443");
let svcChannel = new core.services.channel(svcIota.iota);

let state = core.services.channel.create();
fs.writeFileSync("channel.info.json", JSON.stringify(state, null, "  "));

let root = svcChannel.getRoot(state);
let key = state.channel.side_key;

let subscription = core.services.channel.initSubscriber("test", root, key);
fs.writeFileSync("channel.subscription.json", JSON.stringify(subscription, null, "  "))
