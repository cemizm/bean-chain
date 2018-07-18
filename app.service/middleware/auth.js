const Client = require('../lib/beanchain.client');
const atob = require('atob');

module.exports = function(config) {
  return async (req, res, next) => {

    let identity = req.headers.identity;

    try {
      identity = atob(identity);
      req.identity = JSON.parse(identity);

      if(!req.identity)
        throw new Error();

      req.client = await Client.initWithIdentity(config, req.identity);

    } catch(err) {
      console.log(err)
      return res.status(401).send("no authentication headers");
    }

    next();
  };
}
