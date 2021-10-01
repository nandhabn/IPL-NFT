const { ethers } = require('ethers');
const config = require('./config');
const { adminPrivateKey } = require('./config');

const provider = new ethers.providers.JsonRpcProvider({
  url: config.jsonRPCProvider,
});
const wallet = new ethers.Wallet(adminPrivateKey, provider);
module.exports = { wallet };
