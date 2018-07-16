const gulp = require('gulp');
const args = require('./lib/args');
const Network = require('./lib/network')

const Hyperledger = require('core.hyperledger');

gulp.task('chaincode.update', async (cb) =>{
    let config = Network.development;
    let version = 'V2';
    
    if(args.production)
        config = Network.production;

    if(args.ccv)
        version = args.ccv;

    let client = await Hyperledger.initFromConfig(config);
    try {
        let response = await client.autoUpgradeChaincode('./hyperledger.chaincode', 'vending', version, 'node');
        console.log(response);
    }
    catch(e) {
        console.log(e);
    }
});