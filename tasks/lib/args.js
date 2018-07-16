const yargs = require('yargs');

module.exports = yargs
  .option('production', {
    boolean: true,
    default: false,
    describe: 'build for production environment'
  })
  .option('ccv', {
    type: 'string',
    default: 'V1',
    describe: 'version for chaincode'
  })
  .argv
