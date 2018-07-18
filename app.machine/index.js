const CCI = require('./lib/cci.interface');
const BeaconScanner = require('./lib/beacon.scanner');
const Beanchain = require('./lib/beanchain.client');

const config = {
    host: "http://health-ledger.westeurope.cloudapp.azure.com:8000",
    identity: {
        username:"machine",
        mspid:"MainOrgMSP",
        key:"-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgwZAovy8ASvkCMwPm\noy4boJ+laXtMvv0wAFWom2dgZWOhRANCAATv5bUxp+htjh9WJpAATOi9vFyx4EvV\nY+qnQvLm3ALayZFsbqWensdut0uohaOCTxWNedLT2pRp8GJmP/TXikRc\n-----END PRIVATE KEY-----",
        cert:"-----BEGIN CERTIFICATE-----\nMIICNDCCAdmgAwIBAgIQCfhenylwqwBQTXQR2QLaxDAKBggqhkjOPQQDAjB4MQsw\nCQYDVQQGEwJERTEMMAoGA1UECBMDTlJXMRIwEAYDVQQHEwlCaWVsZWZlbGQxITAf\nBgNVBAoTGG1haW5vcmcuaGVhbHRoLWxlZGdlci5kZTEkMCIGA1UEAxMbY2EubWFp\nbm9yZy5oZWFsdGgtbGVkZ2VyLmRlMCAXDTE4MDcxNjE4Mjg0OVoYDzIxMTgwNjIy\nMTgyODQ5WjBuMR4wHAYDVQQDDBVDb2ZmZSBNYWNoaW5lIEtpdGNoZW4xCzAJBgNV\nBAYTAkRFMQwwCgYDVQQIDANOUlcxHzAdBgNVBAoMFm1haW5vcmcuYmVhbi1jaGFp\nbi5vcmcxEDAOBgNVBAsMB01hY2hpbmUwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNC\nAATv5bUxp+htjh9WJpAATOi9vFyx4EvVY+qnQvLm3ALayZFsbqWensdut0uohaOC\nTxWNedLT2pRp8GJmP/TXikRco00wSzAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/\nBAIwADArBgNVHSMEJDAigCBm2ARXOoMTnj6ujDrQ0pehWt5kgBhEVTWSVsNIlm4A\nKjAKBggqhkjOPQQDAgNJADBGAiEAshLx9mVPdocFdDtph8ZEqpMaGZWLpPZOlF2L\nHiUGeLoCIQCesetUszUtH6a+rPjlPZra7H8q1ZEegw4ZdZVlzdSiHQ==\n-----END CERTIFICATE-----"
    },
    serial: "/dev/tty.wchusbserial1410",
    timeout: 15000,
    beacon: {
        threshold: -34,
        throttle: 5000
    }
}

const state = {
    active: false,
    id: null,
    account: null,
    timer: null,
    pending: false,
}

const cci = new CCI(config.serial);
const scanner = new BeaconScanner(config.beacon.threshold, config.beacon.throttle);
const client = new Beanchain(config.host, config.identity);

cci.setPrice(0 ,'001', 1.2);

cci.on('status', (request, response) => {
    console.log('Status: %o', request);

    response.status = state.account ? 1 : 0;
    response.responseTime = 20;
});

cci.on('credit', (request, response) => {
    console.log('Credit: %o', request);

    response.creditOrPrice = state.account ? state.account.credit : 0;
});

cci.on('vend', (request, response) => {
    console.log('Vend: %o', request);
    state.active = request.mode;
});

cci.on('inquiry', async (request, response) => {
    console.log('inquiry: %o', request);
    let price = cci.getPrice(0, request.product);

    if(!price)
        return;

    if(!state.account)
        return;

    state.pending = true;
    
    if(state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
    }
    
    try {
        if(request.debit) {
            await client.transaction_redeem(state.id, price, request.product);
        }

        response.status = true;
    }
    catch (err) {
        response.status = false;
    }

    state.pending = false;
});

scanner.on('beacon', async (beacon) => {
    if(state.pending)
        return;

    try {
        let id = beacon.uuid;
        let account = await client.account_get(id);
        if(account == null)
            return;

        console.log(account);
        
        state.id = id;
        state.account = account;

        if(state.timer)
            clearTimeout(state.timer);

        state.timer = setTimeout(async ()=> {
            state.account = null;
            state.timer = null;
        }, config.timeout)
    }
    catch(err) { }
});

cci.open();
scanner.start();