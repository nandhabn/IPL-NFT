/* eslint-disable no-undef */
const IPLM = artifacts.require("MomentSale");
const IPLT = artifacts.require("IPLToken");

const constants = require("../../iplt-frontend/src/utils/constants.json");
const constantsBacked = require("../../iplt-backend/src/utils/contractIds.json");
const fs = require("fs");
const path = require("path");
// const { format } = require("prettier");

module.exports = async function (deployer) {
  await deployer.deploy(IPLT);
  await deployer.deploy(IPLM, IPLT.address);

  let iplm = fs.readFileSync("./build/contracts/MomentSale.json");
  iplm = JSON.stringify(JSON.parse(iplm).abi);
  fs.writeFileSync(
    path.resolve("../iplt-frontend/src/contracts/IPLMoments.json"),
    iplm
  );

  fs.writeFileSync(
    path.resolve("../iplt-backend/src/contracts/IPLMoments.json"),
    iplm
  );

  let iplt = fs.readFileSync("./build/contracts/IPLToken.json");
  iplt = JSON.stringify(JSON.parse(iplt).abi);
  fs.writeFileSync(
    path.resolve("../iplt-backend/src/contracts/IPLToken.json"),
    iplt
  );

  fs.writeFileSync(
    path.resolve("../iplt-frontend/src/contracts/IPLToken.json"),
    iplt
  );

  fs.writeFileSync(
    path.resolve("../iplt-frontend/src/utils/constants.json"),
    JSON.stringify({
      ...constants,
      contractIds: { IPLMoments: IPLM.address, IPLToken: IPLT.address },
    })
  );

  fs.writeFileSync(
    path.resolve("../iplt-backend/src/utils/contractIds.json"),
    JSON.stringify({
      ...constantsBacked,
      contractIds: { IPLMoments: IPLM.address, IPLToken: IPLT.address },
    })
  );
  // format("", { filepath: "../iplt-frontend/src/utils/constants.json" });
};
