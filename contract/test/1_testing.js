const IPLM = artifacts.require("MomentSale");
const IPLT = artifacts.require("IPLToken");

module.exports = async function (deployer) {
  try {
    const t = await IPLT.deployed();
    const m = await IPLM.deployed();

    console.log(await m.owner());
    // await m.createPlay(
    //   "https://public.nftstatic.com/static/nft/zipped/6705dc005b55483799f8dec613cebd42_zipped.gif",
    //   0
    // );
    // await m.mintAndTransferPack(
    //   [0],
    //   "20100000000000000000",
    //   "0xE28C35B4eF56d799e3EC11FD4d81c14d2566E39f"
    // );
    // let cost = await m.getRedeemCost(
    //   "0xE28C35B4eF56d799e3EC11FD4d81c14d2566E39f"
    // );
    // cost = Number(cost.toString());
    // console.log("test", cost);
    // await m.redeemPack({
    //   from: "0xE28C35B4eF56d799e3EC11FD4d81c14d2566E39f",
    //   value: cost,
    // });
  } catch (e) {
    console.log(e);
  }
};
