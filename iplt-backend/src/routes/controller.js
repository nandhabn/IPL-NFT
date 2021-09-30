const { isEmpty, map, isNumber } = require('lodash');
const packsModel = require('../model/packs.model');
const Plays = require('../model/plays.model');
const contracts = require('../contracts');
const ObjectId = require('mongoose').Types.ObjectId;
const { successMsg } = require('../utils/constants');

exports.buyTokens = async (req, res, next) => {
  try {
    const { packId } = req.body;
    const pack = await packsModel.findOne({ _id: ObjectId(packId) });

    if (isEmpty(pack)) {
      throw Error(errorMsg.packNotFound);
    }

    let plays = map(pack.cardsPerType, async ({ tokenType, tokenToMint }) => {
      const play = await Plays.aggregate([
        { $match: { tokenType } },
        { $sample: { size: tokenToMint } },
        { $project: { _id: 0, playID: 1 } },
      ]).lean();
      return map(play, 'playID');
    });
  } catch (err) {
    return next(err);
  }
};

exports.getPacks = async (req, res, next) => {
  try {
    const packs = packsModel.find({});
    return res.status(200).json({ packs });
  } catch (e) {
    return next(e);
  }
};

exports.createPack = async (req, res, next) => {
  try {
    const { packName, cardsPerType, price } = req.body;

    if (isEmpty(packName) || isEmpty(cardsPerType) || !isNumber(price)) {
      throw Error('Invalid data');
    }

    await packsModel.create({ packName, cardsPerType, price });

    return res.status(200).send(successMsg.packCreated);
  } catch (e) {
    return next({ message: e.message });
  }
};
