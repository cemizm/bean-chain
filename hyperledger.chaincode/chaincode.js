'use strict';
const shim = require('fabric-shim');
const util = require('util');

const jsonstate = require('./utils/jsonstate')
const VMLedger = require('./vending')

let Chaincode = class {

  async Init(stub) {
    console.info('=========== Instantiated chaincode ===========');
    return shim.success();
  }

  async Invoke(stub) {
    console.info('=========== Invoke chaincode ===========');
    let args = stub.getFunctionAndParameters();

    let identity = new shim.ClientIdentity(stub)
    let state = new jsonstate(stub);

    let ledger = new VMLedger(identity, state)

    console.info(`function: ${args.fcn}`)
    console.info(`params: ${args.params}`)

    let info = null;

    try {
      let payload = null;

      switch(args.fcn) {
        case 'account.getByCardnumber':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');
          payload = await ledger.getAccountByCardnumber(args.params[0])
          break;
        case 'account.getBySerial':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');
          payload = await ledger.getAccountBySerial(args.params[0])
          break;

        case 'account.getall':
          payload = await ledger.getAccounts();
          break;

        case 'account.add':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');
          
          info = JSON.parse(args.params[0]);

          payload = await ledger.createAccount(info);
          break;

        case 'account.update':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');
          
          info = JSON.parse(args.params[0]);

          payload = await ledger.updateAccount(info);
          break;
        
        case 'transaction.get':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');
          
          payload = await ledger.getTransactions(args.params[0]);
          break;
        
        case 'transaction.add':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');
          
          info = JSON.parse(args.params[0]);

          payload = await ledger.addTransaction(info);
          break;

        default:
          throw new Error('unknown function');
      }

      console.info(`result: ${JSON.stringify(payload)}`);

      payload = payload ? Buffer.from(JSON.stringify(payload)) : payload
      return shim.success(payload);

    } catch(err) {
      return shim.error(err);
    }
  }

};

shim.start(new Chaincode());
