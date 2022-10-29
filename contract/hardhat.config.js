require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/**
 * @type {import("hardhat/types").HardhatConfig}
 */
const config = {
  defaultNetwork: "localhost",
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545",
    },
    sepolia: {
      url: "https://rpc.sepolia.org/",
      gas: 14,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
  },
  mocha: {
    timeout: 20000,
  },
};

module.exports = config;
