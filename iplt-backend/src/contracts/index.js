const ethers = require('ethers');
const config = require('../utils/config');
const { contractIds } = require('../utils/contractIds.json');
const momentAbi = require('../contracts/IPLMoments.json');
const tokenAbi = require('../contracts/IPLToken.json');
const { wallet } = require('../utils/wallet');

const provider = new ethers.providers.JsonRpcProvider({
  url: config.jsonRPCProvider,
});
const IPLM = new ethers.Contract(contractIds.IPLMoments, momentAbi, provider);
const IPLT = new ethers.Contract(contractIds.IPLToken, tokenAbi, provider);

const IPLMSigned = new ethers.Contract(
  contractIds.IPLMoments,
  momentAbi,
  wallet.provider.getSigner()
);
const IPLTSigned = new ethers.Contract(
  contractIds.IPLToken,
  tokenAbi,
  wallet.provider.getSigner()
);

module.exports = { IPLM, IPLT, IPLMSigned, IPLTSigned };
