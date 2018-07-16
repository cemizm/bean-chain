const Hyperledger = require('core.hyperledger');

const chaincodeId = 'vending';

module.exports = class VendingClient {
    constructor(client){
        this.client = client;
    }

    static async initWithIdentity(config, identity){
        let c = Object.assign({}, config);
        c.identity = identity;

        let client = await Hyperledger.initFromConfig(c);

        return new VendingClient(client);
    }

    async getAccountByCardnumber(cardnumber) {
        return await this.client.queryByChaincode(chaincodeId, 'account.getByCardnumber', [cardnumber]);
    }
    
    async getAccountBySerial(serial) {
        return await this.client.queryByChaincode(chaincodeId, 'account.getBySerial', [serial]);
    }

    async getAccounts() {
        return await this.client.queryByChaincode(chaincodeId, 'account.getall');
    }

    async addAccount(info) {
        await this.client.autoSendTransaction(chaincodeId, 'account.add', [JSON.stringify(info)]);
    }

    async updateAccount(info) {
        await this.client.autoSendTransaction(chaincodeId, 'account.update', [JSON.stringify(info)]);
    }

    async getTransaction(serial) {
        return await this.client.queryByChaincode(chaincodeId, 'transaction.get', [serial]);
    }

    async addTransaction(info) {
        await this.client.autoSendTransaction(chaincodeId, 'transaction.add', [JSON.stringify(info)]);
    }


}
