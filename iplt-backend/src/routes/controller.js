const { isEmpty, map, isNumber, flatten } = require('lodash');
const packsModel = require('../model/packs.model');
const Plays = require('../model/plays.model');
const contracts = require('../contracts');
const ObjectId = require('mongoose').Types.ObjectId;
const { successMsg, errorMsg } = require('../utils/constants');

exports.buyTokens = async (req, res, next) => {
  try {
    const { packId, account } = req.body;
    const pack = await packsModel.findOne({ _id: ObjectId(packId) });

    if (isEmpty(pack)) {
      throw Error(errorMsg.packNotFound);
    }

    let plays = map(pack.cardsPerType, async ({ tokenType, tokensToMint }) => {
      const play = await Plays.aggregate([
        { $match: { tokenType } },
        { $sample: { size: Number(tokensToMint) } },
        { $project: { _id: 0, playID: 1 } },
      ]);
      return map(play, 'playID');
    });

    plays = flatten(await Promise.all(plays));

    if (isEmpty(plays)) {
      throw new Error('No play is in sale');
    }

    console.log(plays, pack.price.toString(), account);
    const tx = await contracts.IPLMSigned.mintAndTransferPack(
      plays,
      pack.price.toString(),
      account
    );

    return res
      .status(200)
      .json({ message: 'Pack minted successfully', txHash: tx.hash });
  } catch (err) {
    console.log(err.message);
    return next(err.message);
  }
};

exports.getPacks = async (req, res, next) => {
  try {
    const packs = await packsModel.find({}).lean();
    return res.status(200).json({ packs });
  } catch (e) {
    console.log(e);
    return next(e.message);
  }
};

exports.createPack = async (req, res, next) => {
  try {
    const { packName, cardsPerType, price } = req.body;

    if (isEmpty(packName) || isEmpty(cardsPerType) || !isNumber(price)) {
      throw Error('Invalid data');
    }

    await packsModel.create({ packName, cardsPerType, price });

    return res.status(200).json({ message: successMsg.packCreated });
  } catch (e) {
    return next({ message: e.message });
  }
};
