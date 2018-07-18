const Hyperledger = require('./hyperledger.client');

const chaincodeId = 'beanchain';

module.exports = class BeanchainClient {
    constructor(client){
        this.client = client;
    }

    static async initWithIdentity(config, identity){
        let c = Object.assign({}, config);
        c.identity = identity;

        let client = await Hyperledger.initFromConfig(c);

        return new BeanchainClient(client);
    }

    async account_get(id) {
        return await this.client.queryByChaincode(chaincodeId, 'account.get', [id]);
    }

    async account_getTransactions(id) {
        return await this.client.queryByChaincode(chaincodeId, 'account.getTransactions', [id]);
    }

    async account_post(id) {
        return await this.client.autoSendTransaction(chaincodeId, 'account.post', [id]);
    }

    async manager_get() {
        return await this.client.queryByChaincode(chaincodeId, 'manager.get');
    }

    async manager_getTransactions() {
        return await this.client.queryByChaincode(chaincodeId, 'manager.getTransactions');
    }

    async manager_post() {
        return await this.client.autoSendTransaction(chaincodeId, 'manager.post');
    }

    async manager_put(info) {
        return await this.client.autoSendTransaction(chaincodeId, 'manager.put', [JSON.stringify(info)]);
    }

    async transaction_redeem(info) {
        return await this.client.autoSendTransaction(chaincodeId, 'transaction.redeem', [JSON.stringify(info)]);
    }

    async transaction_recharge(info) {
        return await this.client.autoSendTransaction(chaincodeId, 'transaction.recharge', [JSON.stringify(info)]);
    }
}
