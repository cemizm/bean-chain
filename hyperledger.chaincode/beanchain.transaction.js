const BeanchainBase = require('./beanchain.base')
const uuid = require('uuid/v4');

module.exports = class extends BeanchainBase {
    constructor(identity, state) {
        super(identity, state);
    }

    async _createTransaction(amount, accountid, note) {
        let tid = `transaction_${uuid()}`;
        let aid = `account_${accountid}`.toLowerCase();

        let account = await this.state.get(aid);
        if(account == null)
            throw new Error(`Account ${accountid} does not exists`)

        account.credit += amount;
        if(account.credit < 0)
            throw new Error("Insufficient credits for transaction");
        
        await this.state.put(aid, account)

        let type = amount < 0 ? 'redeem' : 'recharge';
        let text = `${type} by ${this.CommonName}: ${note}`

        let transaction =  {
            type: 'transaction',
            date: Date.now(),
            amount: amount,
            account: accountid.toLowerCase(),
            note: text,
            source: this.UserId
        }

        await this.state.put(tid, transaction);
    }

    async redeem(amount, accountid, note) {
        if(this.UserType !== 'Machine')
            throw new Error("Only vending machines can redeem credits");
        
        await this._createTransaction(-amount, accountid, note)
    }

    async recharge(amount, accountid, note) {
        if(this.UserType !== 'Payment')
            throw new Error("Only payment providers can recharge credits");

        await this._createTransaction(amount, accountid, note)
    }
}