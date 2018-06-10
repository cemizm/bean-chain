const core = require('bc-core');
const Rx = require('rxjs');

module.exports = class PaymentController {

  constructor(seed, hostOrIota) {
    this.seed = seed;
    this.address = "";
    this.index = 0;
    this.iota = new core.services.iota(hostOrIota);

    this.addressUpdated = new Rx.Subject();
    this.paymentReceived = new Rx.Subject();
  }

  static async create(seed, hostOrIota) {
    let controller = new PaymentController(seed, hostOrIota);
    controller.initialize();
    return controller;
  }

  async initialize() {
    console.log("init");

    await this.updateAddress();
    await this.checkTransactions();
  }

  async updateAddress() {
    console.log("updateAddress");
    let addresses = await this.iota.getNewAddress(this.seed, { checksum:true, index:this.index, returnAll:true });

    let temp = addresses.pop();
    if(this.address == temp)
      return;

    this.address = temp;
    this.index += addresses.length + 1;
    this.addressUpdated.next(this.address);
  }

  async checkTransactions() {
    console.log("checkTransactions")
    let transactions = await this.iota.findTransactionObjects({ addresses: [this.address] });
    if(transactions.length > 0){
      let payment = this.iota.decodeTransactions(transactions);

      this.paymentReceived.next(payment);

      await this.updateAddress();
    }
    setTimeout(() => this.checkTransactions(), 5000);
  }



}
