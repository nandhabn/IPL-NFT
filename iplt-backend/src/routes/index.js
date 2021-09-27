const {
  ethers: {
    utils: { defaultAbiCoder, toUtf8Bytes },
  },
} = require('ethers');
const express = require('express');
const router = express.Router();

const Plays = require('../model/plays.model');
const { wallet } = require('../utils/wallet');

router.put('/redeem', async function (req, res, next) {
  try {
    const { packType } = req.body;
    const plays = await Plays.find({
      playID: { $in: playIds },
    }).lean();

    const encoded = defaultAbiCoder.encode(['uint256[]'], [playIds]);
    const signedMessage = await wallet.signMessage(toUtf8Bytes(encoded));

    return res.json({ signedMessage, plays });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
