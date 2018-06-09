const IOTA = require('iota.lib.js');
const MAM = require('mam.client.js');

const iota = new IOTA({
  host: 'https://cvnode.codeworx.de',
  port: 443
});

const seed = "XEIUDATKKMNPQXASWRAPPRZJYKLAZGBORFMJDAVFLUKFQRFJIHEP9JHRESRGWJKOASHGMNWOPASPOJLOP";
const key = "WORKHARDPLAYHARD";

var state = MAM.init(iota, seed);
 MAM.changeMode(state, 'restricted', key);

async function publish(payload) {
  //restore state otherwise the new message will be attached to first root
  var root = MAM.getRoot(state);
  var result = await MAM.fetch(root, 'restricted', key);

  if(root != result.nextRoot){
    state.channel.next_root = result.nextRoot;
    state.channel.start = result.messages.length;
    payload.with.and.items = result.messages.length;
  }

  //create message and attach
  var data = JSON.stringify(payload);
  var message = MAM.create(state, iota.utils.toTrytes(data));
  await MAM.attach(message.payload, message.address);

  console.log('Root: ', message.root);
  console.log('Address:', message.address);
}

publish({
  a:'very',
  complex: ['o', 'b', 'j', 'e', 'c', 't'],
  with:{
    nested: 'childs',
    and: {
      arrays: 'of',
      items: 1337
    }
  }
});
