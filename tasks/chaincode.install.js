const gulp = require('gulp');
const args = require('./lib/args');
const Network = require('./lib/network')

const Hyperledger = require('core.hyperledger');

gulp.task('chaincode.install', async (cb) =>{
    let config = Network.development;
    
    if(args.production)
        config = Network.production;

    let client = await Hyperledger.initFromConfig(config);

    try {
        let response = await client.autoInstallChaincode('./hyperledger.chaincode', 'vending', 'V1', 'node');
        console.log(response);
    }
    catch(e) {
        console.log(e);
    }
});