const playListener = require('./play.listener');
const contracts = require('../contracts');
module.exports = () => {
  playListener(contracts.IPLM);
};
