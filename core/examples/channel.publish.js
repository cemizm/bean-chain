const core = require('../')
const fs = require('fs');

let state = JSON.parse(fs.readFileSync("channel.info.json"));

let svcIota = new core.services.iota("https://cvnode.codeworx.de:443");
let svcChannel = new core.services.channel(svcIota.iota);

svcChannel.publish(state, {
  a:'very',
  complex: ['o', 'b', 'j', 'e', 'c', 't'],
  with:{
    nested: 'childs',
    and: {
      arrays: 'of',
      items: 133,
      seven: ''
    }
  }
});


fs.writeFileSync("channel.info.json", JSON.stringify(state, null, "  "));
