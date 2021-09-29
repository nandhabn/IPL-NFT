const {
  ethers: {
    utils: { defaultAbiCoder, toUtf8Bytes },
  },
} = require('ethers');
const express = require('express');
const packsModel = require('../model/packs.model');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const Plays = require('../model/plays.model');
const { wallet } = require('../utils/wallet');

router.put('/buyCard', async function (req, res, next) {
  try {
    // const { packId } = req.body;
    // const pack = await packsModel.aggregate([
    //   { $match: { _id: ObjectId(packId) } },
    //   {
    //     $map: {
    //       input: '$cardsPerType',
    //       as: 'card',
    //       in: {
    //         $lookup: {},
    //       },
    //     },
    //   },
    // ]);

    // const plays = await Plays.find({
    //   playID: { $in: playIds },
    // }).lean();

    // const encoded = defaultAbiCoder.encode(['uint256[]'], [playIds]);
    // const signedMessage = await wallet.signMessage(toUtf8Bytes(encoded));

    // return res.json({ signedMessage, plays });
    return res.json({ inProgress: 'in-progress' });
  } catch (err) {
    return next(err);
  }
});

router.get('/packs', (req, res, next) => {
  try {
    const packs = packsModel.find({});
    return res.status(200).json({ packs });
  } catch (e) {
    return next(e);
  }
});

router.get('/ping', (req, res) => res.status(200).send('pong'));

module.exports = router;
