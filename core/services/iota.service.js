const IOTA = require('iota.lib.js');
const DEPTH = 3; // constant defined by IOTA - how deep to look for the tips in the Tangle
const MAGNITUDE = 16; // constant defined by IOTA - the difficulty of PoW

module.exports = class IotaService {

  constructor(instanceOrProvider){
    if(typeof(instanceOrProvider) === 'string')
      this.iota = new IOTA({provider: instanceOrProvider});
    else
      this.iota = instanceOrProvider;
  }

  getNewAddress(seed, options = {}) {
    return new Promise((resolve, reject) =>{
      this.iota.api.getNewAddress(seed, options, (error, result) => {
        if(error) return reject(new Error(error));

        resolve(result);
      });
    });
  }

  sendTransfer(seed, transfers, options = {}) {
    return new Promise((resolve, reject) => {
      this.iota.api.sendTransfer(seed, DEPTH, MAGNITUDE, transfers, options, (error, result) => {
        if(error) return reject(error);

        resolve(result);
      });
    });
  }

  getAccountData(seed, options = {}){
    return new Promise((resolve, reject) =>{
      var data = this.iota.api.getAccountData(seed, options, (error, result) => {
        if(error) return reject(error);
        resolve(result);
      });
    });
  }

  findTransactionObjects(searchValues) {
    return new Promise((resolve, reject) =>{
      var data = this.iota.api.findTransactionObjects(searchValues, (error, result) => {
        if(error) return reject(error);
        resolve(result);
      });
    });
  }

  getTransactionsObjects(hashes) {
    return new Promise((resolve, reject) =>{
      var data = this.iota.api.getTransactionsObjects(hashes, (error, result) => {
        if(error) return reject(error);
        resolve(result);
      });
    });
  }

  decodeTransactions(transactions) {
    let transaction = transactions[0]
    transactions.sort((a,b)=>{
      if(a.currentIndex < b.currentIndex)
        return -1;

      if(a.currentIndex > b.currentIndex)
        return 1;

      return 0;
    });
    var message = "";
    transactions.forEach(t => { message += t.signatureMessageFragment })
    message = message.replace(/9*$/, '');
    if(!message)
      return {transaction, message};

    message = this.iota.utils.fromTrytes(message);

    return {transaction, message};
  }
}
