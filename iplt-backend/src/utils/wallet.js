const { ethers } = require('ethers');
const { adminPrivateKey } = require('./config');

const wallet = new ethers.Wallet(adminPrivateKey);
module.exports = { wallet };
