const BeanchainBase = require('./beanchain.base')

module.exports = class extends BeanchainBase {
    constructor(identity, state) {
        super(identity, state);
    }

    get Key() {
        return `manager_${this.UserId}`;
    }

    async _get(throwError = false) {
      let result = await this.state.get(this.Key);
  
      if(throwError && result == null)
        throw new Error("_get: Unknown manager with id '" + this.UserId + "'");
  
      return result;
    }

    _checkUserType(){
        if(this.UserType !== 'Manager')
            throw new Error("Only Manager can call this method");
    }

    async get() {
        this._checkUserType();

        let manager = await this._get(true);

        return {
            name: this.CommonName,
            machines: manager.machines
        }
    }

    async post() {
        this._checkUserType();

        let manager = await this._get(false);
        if(manager)
            throw new Error(`Manager '${this.UserId}' already exists`);

        manager = {
            type: 'manager',
            machines: []
        }

        await this.state.put(this.Key, manager)
    }

    async put(info) {
        this._checkUserType();

        let manager = await this._get(true);

        let machines = [];
        for(let machine of info.machines) {
            machines.push({
                id: machine.id,
                name: machine.name,
                location: machine.location
            });
        }
        manager.machines = machines;

        await this.state.put(this.Key, manager)
    }

    async getTransactions() {
        this._checkUserType();

        let manager = await this._get(true);

        let sources = [];
        for(let machine of manager.machines) {
            sources.push(machine.id);
        }

        let results = await this.state.query({selector: {
            type: 'transaction',
            source: { $in: sources }
        }})

        let transactions = [];
        for (let result of results) {
            let t = result.value;
            transactions.push({
                date: t.date,
                amount: t.amount,
                machine: t.source,
                account: t.account,
                note: t.note
            })
        }

        return transactions;
    }
}