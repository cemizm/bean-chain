const IOTA = require('iota.lib.js')
const DEPTH = 3; // constant defined by IOTA - how deep to look for the tips in the Tangle
const MAGNITUDE = 16; // constant defined by IOTA - the difficulty of PoW

module.exports = class IotaClient {

  constructor(seed, options) {
    this.seed = seed;
    this.iota = new IOTA(options);
    this.utils = this.iota.utils;
  }

  getNewAddress(options = {}) {
    return new Promise((resolve, reject) =>{

      this.iota.api.getNewAddress(this.seed, options, (error, result) => {
        if(error)
          return reject(new Error(error));

        resolve(result);
      });

    });
  }

  sendTransfer(transfers, options = {}) {
    return new Promise((resolve, reject) =>{
      this.iota.api.sendTransfer(this.seed, DEPTH, MAGNITUDE, transfers, options, (error, result) => {
        if(error)
          return reject(error);
        resolve(result);
      });
    });
  }

  getAccountData(options = {}){
    return new Promise((resolve, reject) =>{
      var data = this.iota.api.getAccountData(this.seed, options, (error, result) => {
        if(error)
          return reject(error);
        resolve(result);
      });
    });
  }

  findTransactionObjects(searchValues) {
    return new Promise((resolve, reject) =>{
      var data = this.iota.api.findTransactionObjects(searchValues, (error, result) => {
        if(error)
          return reject(error);
        resolve(result);
      });
    });
  }

  getTransactionsObjects(hashes) {
    return new Promise((resolve, reject) =>{
      var data = this.iota.api.getTransactionsObjects(hashes, (error, result) => {
        if(error)
          return reject(error);
        resolve(result);
      });
    });
  }
}
