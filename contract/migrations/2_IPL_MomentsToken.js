/* eslint-disable no-undef */
const IPLM = artifacts.require("MomentSale");
const IPLT = artifacts.require("IPLToken");

const constants = require("../../src/utils/constans.json");
const fs = require("fs");
const path = require("path");

module.exports = async function (deployer) {
  await deployer.deploy(IPLT);
  await deployer.deploy(IPLM, IPLT.address);

  let iplm = fs.readFileSync("./build/contracts/MomentSale.json");
  iplm = JSON.stringify(JSON.parse(iplm).abi);
  fs.writeFileSync(path.resolve("../src/contracts/IPLMoments.json"), iplm);

  let iplt = fs.readFileSync("./build/contracts/IPLToken.json");
  iplt = JSON.stringify(JSON.parse(iplt).abi);
  fs.writeFileSync(path.resolve("../src/contracts/IPLToken.json"), iplt);

  fs.writeFileSync(
    path.resolve("../src/utils/constans.json"),
    JSON.stringify({
      ...constants,
      contractIds: { IPLMoments: IPLM.address, IPLToken: IPLT.address },
    })
  );
};
