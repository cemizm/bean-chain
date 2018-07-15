var nfc  = require('nfc').nfc, util = require('util');

var device = new nfc.NFC();
device.on('read', function(tag) {
    // { deviceID: '...', name: '...', uid: '...', type: 0x04 (Mifare Classic) or 0x44 (Mifare Ultralight) }

    if ((!!tag.data) && (!!tag.offset)) console.log(util.inspect(nfc.parse(tag.data.slice(tag.offset)), { depth: null }));
}).on('error', function(err) {
    // handle background error;
}).start();

module.exports = class NFC {

}