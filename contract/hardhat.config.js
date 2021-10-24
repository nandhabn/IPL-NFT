require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "localhost",
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  network: {
    localhost: {
      url: "http://127.0.0.1:7545",
    },
  },
  mocha: {
    timeout: 20000,
  },
};
