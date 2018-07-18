'use strict';
const shim = require('fabric-shim');
const util = require('util');

const jsonstate = require('./utils/jsonstate')
const BCAccount = require('./beanchain.account');
const BCManager = require('./beanchain.manager');
const BCTransaction = require('./beanchain.transaction');

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

    let bc_account = new BCAccount(identity, state)
    let bc_manager = new BCManager(identity, state)
    let bc_transaction = new BCTransaction(identity, state)

    console.info(`function: ${args.fcn}`)
    console.info(`params: ${args.params}`)

    let info = null;

    try {
      let payload = null;

      switch(args.fcn) {

        case 'account.get':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');
            
          payload = await bc_account.get(args.params[0]);
          break;
        case 'account.getTransactions':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');

          payload = await bc_account.getTransactions(args.params[0]);
          break;
        case 'account.post':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');

          payload = await bc_account.post(args.params[0]);
          break;


        case 'manager.get':
          payload = await bc_manager.get();
          break;
        case 'manager.getTransactions':
          payload = await bc_manager.getTransactions();
          break;
        case 'manager.post':
          payload = await bc_manager.post();
          break;
        case 'manager.put':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');
        
          info = JSON.parse(args.params[0]);

          payload = await bc_manager.put(info);
          break;


        case 'transaction.redeem':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');
          
          info = JSON.parse(args.params[0]);

          payload = await bc_transaction.redeem(info.amount, info.account, info.note);
          break;
        case 'transaction.recharge':
          if(!args.params || args.params.length != 1)
            throw new Error('insufficient parameters');
          
          info = JSON.parse(args.params[0]);
            
          payload = await bc_transaction.recharge(info.amount, info.account, info.note);
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
