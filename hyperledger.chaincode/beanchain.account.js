const BeanchainBase = require('./beanchain.base')
const uuid = require('uuid/v4');

module.exports = class extends BeanchainBase {
    constructor(identity, state) {
        super(identity, state);
    }

    _checkUserType(){
        if(this.UserType !== 'Mobile')
            throw new Error("Only Mobile can call this method");
    }

    async _get(id, throwError = true) {
        let aid = `account_${id}`.toLowerCase();

        let account = await this.state.get(aid);
        if(!account && throwError)
            throw new Error(`Account ${id} does not exists`);

        return account;
    }

    async get(id) {
        let account = await this._get(id);

        return {
            credit: account.credit
        }
    }

    async getTransactions(id) {
        this._checkUserType();
        let account = await this._get(id);

        let results = await this.state.query({selector: {
            type: 'transaction',
            account: id.toLowerCase()
        }})

        let transactions = [];
        for (let result of results) {
            let t = result.value;
            transactions.push({
                date: t.date,
                amount: t.amount,
                source: t.source,
                account: t.account,
                note: t.note
            })
        }

        return transactions;
    }

    async post(id) {
        this._checkUserType();
        let account = await this._get(id, false);
        if(account !== null)
            throw new Error("Account already exits!")

        let aid = `account_${id}`.toLowerCase();
        
        await this.state.put(aid, {
            type: 'account',
            credit: 0
        });
    }
}