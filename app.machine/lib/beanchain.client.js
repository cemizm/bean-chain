const axios = require('axios');


module.exports = class {
    constructor(host, identity) {
        this.host = host;
        this.identity = identity;

        axios.defaults.baseURL = host;
        axios.defaults.headers.common['identity'] = Buffer.from(JSON.stringify(identity)).toString('base64');
    }

    async account_get(account) {
        let response = await axios.get(`/account/${account}`);
        return response.data;
    }

    transaction_redeem(account, amount, note) {
        return axios.post(`/transaction/redeem`, {account: account, amount: amount, note: note});
    }
}