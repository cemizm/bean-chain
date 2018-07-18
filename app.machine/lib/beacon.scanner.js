const BeaconScanner = require("node-beacon-scanner");

var scanner = new BeaconScanner();

module.exports = class Scanner{
    constructor(rssi, throttle) {
        this.scanner = new BeaconScanner();

        this.rssi = rssi;
        this.throttle = throttle;
        this.cbs = {};

        this.nextbeacon = 0;

        this.scanner.onadvertisement = (advertisement) => this._onAdvertisement(advertisement);
    }

    on(type, cb){
        this.cbs[type] = cb;
    }

    async start() {
        await this.scanner.startScan();
    }

    _execCallback(type, data) {
        if(!this.cbs[type])
            return;

        this.cbs[type](data);
    }

    _onAdvertisement(advertisement) {
        if(advertisement.rssi < this.rssi)
            return;

        if(this.nextbeacon > Date.now())
            return;

        this.nextbeacon = Date.now() + this.throttle;

        this._execCallback('beacon', advertisement.iBeacon);
    }


}