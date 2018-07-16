/*
 * writes and reads json objects from state
 */

module.exports = class {
  constructor(stub) {
    this.stub = stub;
  }

  async get(key) {
    let result = await this.stub.getState(key);

    console.info(`state.get: ${key} => ${result.toString()}`);

    if (result == null || result.toString().length <= 0)
      return null;

    return JSON.parse(result.toString());
  }

  async getStateByRange(startKey, endKey) {
    let result = await this.stub.getStateByRange(startKey, endKey);

    let ret = [];
    let next = {done: false}
    while(next.done === false){
      next = await result.next();

      if(next.value && next.value.value.toString('utf8').length > 0){
        let sObj = next.value.value.toString('utf8');

        ret.push({
          key: next.value.key,
          value: JSON.parse(sObj)
        });

        console.info(`state.query: ${next.value.key} => ${sObj}`);
      }
    }

    return ret;
  }

  async put(key, obj) {
    let sObj = JSON.stringify(obj);

    console.info(`state.put: ${key} => ${sObj}`);

    await this.stub.putState(key, Buffer.from(sObj));
  }

  async query(qry) {
    let q = JSON.stringify(qry);

    let result = await this.stub.getQueryResult(q);

    let ret = [];
    let next = {done: false}
    while(next.done === false){
      next = await result.next();

      if(next.value && next.value.value.toString('utf8').length > 0){
        let sObj = next.value.value.toString('utf8');

        ret.push({
          key: next.value.key,
          value: JSON.parse(sObj)
        });

        console.info(`state.query: ${next.value.key} => ${sObj}`);
      }
    }

    return ret;
  }

}
