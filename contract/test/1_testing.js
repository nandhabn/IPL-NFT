//  To run this file run "truffle exec <filename>"
const IPLM = artifacts.require("MomentSale");
const IPLT = artifacts.require("IPLToken");

module.exports = async function (deployer) {
  try {
    const t = await IPLT.deployed();
    const m = await IPLM.deployed();

    console.log(
      (
        await m.balanceOf("0x4DC93272fdb7207Eee005fC35CceA7A78F6Ea3cc")
      ).toString()
    );

    // await m.createPlay(
    //   "ipfs://bafyreiagpkymraua4zbiechtuxiwnbryuuqo3ayqig4yo3sd3j5ml66lqe/metadata.json",
    //   3
    // );
    // await t.approve(IPLM.address, 1000, {
    //   from: "0xD1f1A2486253F0EEd0dDB86E0abA72f6E3d0Ada8",
    // });

    // await t.transfer("0x4DC93272fdb7207Eee005fC35CceA7A78F6Ea3cc", 1000);

    // await t.approve(IPLM.address, 1000, {
    //   from: "0x4DC93272fdb7207Eee005fC35CceA7A78F6Ea3cc",
    // });
    // let precost = await m.getRedeemCost(
    //   "0x4DC93272fdb7207Eee005fC35CceA7A78F6Ea3cc"
    // );
    // console.log(precost["gasCost"].toString(), precost["packCost"].toString());
    // await m.mintAndTransferPack(
    //   [0],
    //   100,
    //   "0x4DC93272fdb7207Eee005fC35CceA7A78F6Ea3cc"
    // );
    // let cost = await m.getRedeemCost(
    //   "0x4DC93272fdb7207Eee005fC35CceA7A78F6Ea3cc"
    // );
    // const gasCost = Number(cost["gasCost"].toString());

    // console.log(cost["gasCost"].toString(), cost["packCost"].toString());
    // await m.redeemPack({
    //   from: "0x4DC93272fdb7207Eee005fC35CceA7A78F6Ea3cc",
    //   value: gasCost,
    // });
  } catch (e) {
    console.log(e);
  }
};
