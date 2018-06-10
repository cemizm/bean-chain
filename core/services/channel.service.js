const MAM = require('mam.client.js');
const IOTA = require('iota.lib.js');
const uuid = require('uuid');
const Rx = require('rxjs');

module.exports = class ChannelService {
  constructor(instanceOrProvider){
    if(instanceOrProvider == null)
      throw new Error("please provice an instance to an initialized iota object or an url to a node")

    if(typeof(instanceOrProvider) === 'string')
      this.iota = new IOTA({provider: instanceOrProvider});
    else
      this.iota = instanceOrProvider;

    this.Messages = new Rx.Subject();
  }

  static create() {
    let state = MAM.init();
    MAM.changeMode(state, 'restricted', uuid.v4());
    return state;
  }

  static initSubscriber(name, root, key) {
    return {
      name: name,
      key: key,
      roots: {
        initial: root,
        last: root,
        next: root,
      }
    }
  }

  getRoot(state) {
    return MAM.getRoot(state);
  }

  publish(state, message) {
    if(message == null)
      throw new Error("Message to publish cannot be null");

    MAM.init(this.iota)

    var json = JSON.stringify(message);
    var trytes = this.iota.utils.toTrytes(json);
    var masked = MAM.create(state, trytes);
    return MAM.attach(masked.payload, masked.address);
  }

  async getLast(subscription) {
    MAM.init(this.iota);
    let resp = await MAM.fetchSingle(subscription.roots.last, 'restricted', subscription.key);
    if(!resp || !resp.payload)
      return null;

    let json = this.iota.utils.fromTrytes(resp.payload);
    return JSON.parse(json);
  }

  subscribe(subscription, interval = 5000) {
    return setInterval(async () => {
      MAM.init(this.iota)
      let resp = await MAM.fetch(subscription.roots.next, 'restricted', subscription.key);
      if(subscription.roots.next == resp.nextRoot)
        return;

      subscription.roots.last = subscription.roots.next;
      subscription.roots.next = resp.nextRoot;

      let messages = [];
      for(let message of resp.messages) {
        let json = this.iota.utils.fromTrytes(message);
        messages.push(JSON.parse(json));
      }

      this.Messages.next({subscription, messages});

    }, interval);
  }

  cancelSubscription(token) {
    clearInterval(token);
  }

}
