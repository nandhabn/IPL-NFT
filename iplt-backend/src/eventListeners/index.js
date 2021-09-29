const ethers = require('ethers');
const config = require('../utils/config');
const playListener = require('./play.listener');
const { contractIds } = require('../utils/contractIds.json');
const momentAbi = require('../contracts/IPLMoments.json');
const tokenAbi = require('../contracts/IPLToken.json');
module.exports = () => {
  const provider = new ethers.providers.JsonRpcProvider({
    url: config.jsonRPCProvider,
  });
  const IPLM = new ethers.Contract(contractIds.IPLMoments, momentAbi, provider);
  const IPLT = new ethers.Contract(contractIds.IPLToken, tokenAbi, provider);
  playListener(IPLM);
};
