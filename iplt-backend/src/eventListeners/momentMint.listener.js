const playsModel = require('../model/plays.model');
const { rarity } = require('../utils/constants');

module.exports = (contract) => {
  contract.on('momentCreated', async (playID, sn, momentId) => {
    console.log(`momentCreated(${playID}, ${sn}, ${momentId})`);
    const play = await playsModel.findOne({ playID });
    if (rarity[play.totkenType] == sn) {
      await play.remove();
    } else {
      play.count += 1;
      await play.save();
    }
  });
};
