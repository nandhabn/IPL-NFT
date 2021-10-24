/* eslint-disable no-undef */
// const IPLM = artifacts.require("MomentSale");
// const IPLT = artifacts.require("IPLToken");
const hre = require("hardhat");

const constants = require("../../iplt-frontend/src/utils/constants.json");
const constantsBacked = require("../../iplt-backend/src/utils/contractIds.json");
const fs = require("fs");
const path = require("path");
// const { format } = require("prettier");

async function deployer() {
  const IPLM = await hre.ethers.getContractFactory("MomentSale");
  const IPLT = await hre.ethers.getContractFactory("IPLToken");
  const IPLTDeployed = await IPLT.deploy();
  const IPLMDeployed = await IPLM.deploy(IPLTDeployed.address);
  //   const greeter = await Greeter.deploy("Hello, Hardhat!");
  //   await deployer.deploy(IPLT);
  //   await deployer.deploy(IPLM, IPLT.address);

  //   let iplm = fs.readFileSync("./build/contracts/MomentSale.json");
  let iplm = fs.readFileSync(
    path.resolve("./artifacts/contracts/MomentSales.sol/MomentSale.json")
  );
  iplm = JSON.stringify(JSON.parse(iplm).abi);
  fs.writeFileSync(
    path.resolve("../iplt-frontend/src/contracts/IPLMoments.json"),
    iplm
  );

  fs.writeFileSync(
    path.resolve("../iplt-backend/src/contracts/IPLMoments.json"),
    iplm
  );

  //   let iplt = fs.readFileSync("./build/contracts/IPLToken.json");
  let iplt = fs.readFileSync(
    "./artifacts/contracts/IPLToken.sol/IPLToken.json"
  );
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
      contractIds: {
        IPLMoments: IPLMDeployed.address,
        IPLToken: IPLTDeployed.address,
      },
    })
  );

  fs.writeFileSync(
    path.resolve("../iplt-backend/src/utils/contractIds.json"),
    JSON.stringify({
      ...constantsBacked,
      contractIds: {
        IPLMoments: IPLMDeployed.address,
        IPLToken: IPLTDeployed.address,
      },
    })
  );
  // format("", { filepath: "../iplt-frontend/src/utils/constants.json" });
}

deployer()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
