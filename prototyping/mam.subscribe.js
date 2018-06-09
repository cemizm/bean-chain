const IOTA = require('iota.lib.js');
const MAM = require('mam.client.js');

const iota = new IOTA({
  host: 'https://cvnode.codeworx.de',
  port: 443
});

const root = "SSHMUQMFJXRQPK9JMKUINDECTNATKIKGOMJLFMFECCH9UQSDGTASKUEOBDEKMFTOTQWSTNJPMJFGFXSKW";
const key = "WORKHARDPLAYHARD";

async function subscribe() {
  let state = MAM.init(iota);
  let pointer = root;

  while(true) {
    let resp = await MAM.fetch(pointer, 'restricted', key);
    pointer = resp.nextRoot;
    for(let message of resp.messages)
      console.log(JSON.parse(iota.utils.fromTrytes(message)));
  }
}

subscribe();
