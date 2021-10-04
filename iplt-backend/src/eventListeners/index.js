const playListener = require('./play.listener');
const contracts = require('../contracts');
const momentMintListener = require('./momentMint.listener');
module.exports = () => {
  playListener(contracts.IPLM);
  momentMintListener(contracts.IPLM);
};
