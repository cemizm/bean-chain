'use strict';

var Client = require('fabric-client');
var path = require('path');
var fs = require('fs');

module.exports = class Hyperledger {

  constructor(config){
    this.config = config;
    this.client = new Client();
    this.channel = this.client.newChannel(config.channel);

    let suite = Client.newCryptoSuite();
    let crypto = Client.newCryptoKeyStore({path: path.join(__dirname, 'hfc-key-store')});

    suite.setCryptoKeyStore(crypto);
    this.client.setCryptoSuite(suite);

  }

  static async initFromConfig(config) {
    if(config == null)
      throw new Error("no configuration set.")

    let client = new Hyperledger(config)

    for (let peer of config.peers)
      client.addPeer(peer);

    for (let orderer of config.orderers)
      client.addOrderer(orderer);

    if(config.adminIdentity)
      client.setAdminIdentity(config.adminIdentity);

    if(config.identity)
      await client.setIdentity(config.identity);

    return client
  }

  addPeer(host) {
    let peer = this.client.newPeer(host);
    this.channel.addPeer(peer);
  }

  addOrderer(host){
    let orderer = this.client.newOrderer(host);
    this.channel.addOrderer(orderer);
  }

  setAdminIdentity(opts) {
    this.client.setAdminSigningIdentity(opts.key, opts.cert, opts.mspid);
  }

  setIdentity(opts) {
    return this.client.createUser({
      username: opts.username,
      mspid: opts.mspid,
      cryptoContent: {
        privateKeyPEM: opts.key,
        signedCertPEM: opts.cert
      },
      skipPersistence: true
    });
  }

  newTransactionID(admin=false){
    return this.client.newTransactionID(admin);
  }

  async queryByChaincode(chaincodeId, functionName, params = []) {
    let result = await this.channel.queryByChaincode({
      chaincodeId: chaincodeId,
      fcn: functionName,
      args: params
    });

    if(result[0].toString().length <= 0)
      return null;

    return JSON.parse(result[0].toString());
  }

  sendTransactionProposal(txId, chaincodeId, functionName, params = []) {
    return this.channel.sendTransactionProposal({
  		chaincodeId: chaincodeId,
  		fcn: functionName,
  		args: params,
  		chainId: this.config.channel,
  		txId: txId
  	});
  }

  sendTransaction(proposals) {
    var responses = proposals[0];
  	var proposal = proposals[1];

  	if (!responses || !responses[0].response ||
      responses[0].response.status !== 200) {
        throw new Error('proposals are invalid');
    }
    var request = {
      proposalResponses: responses,
      proposal: proposal
    };

    return this.channel.sendTransaction(request);
  }

  checkTransactionEvent(txId) {
    return new Promise((resolve, reject) => {
      if(this.config.hubs == null || this.config.hubs.length == 0)
        reject(new Error('No Event Hubs configured...'));

      let hub = this.client.newEventHub();
      hub.setPeerAddr(this.config.hubs[0]);

      let handle = setTimeout(() => {
        hub.disconnect();
        reject(new Error('Trnasaction did not complete within 30 seconds'));
      }, 30000);

      let txIds = txId.getTransactionID();

      hub.connect();
      hub.registerTxEvent(txIds, (tx, code) => {

        clearTimeout(handle);

        hub.unregisterTxEvent(txIds);
        hub.disconnect();

        if(code !== 'VALID')
          reject(new Error('transaction did not commit: ' + code));

        resolve();
      });
    });
  }

  async autoSendTransaction(chaincodeId, functionName, params = ['']){
    let response = {
      txId: this.newTransactionID()
    };

    response.proposals = await this.sendTransactionProposal(response.txId, chaincodeId, functionName, params);
    response.transaction = await this.sendTransaction(response.proposals);

    await this.checkTransactionEvent(response.txId);

    response.success = true;
    
    return response;
  }

  installChaincode(path, chaincodeId, version = 'v1', type = 'node'){
    return this.client.installChaincode({
      targets: this.channel.getPeers(),
      chaincodePath: path,
      chaincodeId: chaincodeId,
      chaincodeVersion: version,
      chaincodeType: type,
    });
  }

  sendInstantiateProposal(txId, chaincodeId, version = 'v1', type = 'node') {
    return this.channel.sendInstantiateProposal({
      targets: this.channel.getPeers(),
      chaincodeType: type,
      chaincodeId: chaincodeId,
      chaincodeVersion: version,
      txId: txId
    })
  }

  async autoInstallChaincode(path, chaincodeId, version = 'v1', type = 'node') {
    let response = {
      success: false,
      txId: this.client.newTransactionID(true),
    };

    response.install = await this.installChaincode(path, chaincodeId, version, type);

    response.proposals = await this.sendInstantiateProposal(response.txId, chaincodeId, version, type);
    response.transaction = await this.sendTransaction(response.proposals);

    await this.checkTransactionEvent(response.txId);

    response.success = true;
    return response;
  }

  sendUpgradeProposal(txId, chaincodeId, version = 'v1', type = 'node') {
    return this.channel.sendUpgradeProposal({
      targets: this.channel.getPeers(),
      chaincodeType: type,
      chaincodeId: chaincodeId,
      chaincodeVersion: version,
      txId: txId
    })
  }

  async autoUpgradeChaincode(path, chaincodeId, version = 'v1', type = 'node') {
    let response = {
      success: false,
      txId: this.client.newTransactionID(true),
    };

    response.install = await this.installChaincode(path, chaincodeId, version, type);

    response.proposals = await this.sendUpgradeProposal(response.txId, chaincodeId, version, type);
    response.transaction = await this.sendTransaction(response.proposals);

    await this.checkTransactionEvent(response.txId);

    response.success = true;
    return response;
  }

}
