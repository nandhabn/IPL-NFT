const isEmpty = require('lodash/isEmpty');
const playsModel = require('../model/plays.model');

module.exports = (contract) => {
  contract.on('playCreated', async (playID, url, tokenType) => {
    console.log(`playCreated(${playID}, ${url}, ${tokenType})`);
    const play = await playsModel.find({ playID }).lean();
    if (isEmpty(play)) {
      await playsModel.insertMany({ playID, url, tokenType });
    }
  });
};
