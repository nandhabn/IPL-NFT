const mongoose = require('mongoose');

const pack = new mongoose.Schema({
  packName: { type: String, required: true },
  cardsPerType: [
    {
      tokenType: { type: Number, required: true },
      tokensToMint: { type: Number, required: true },
    },
  ],
  price: { type: Number, min: 1 },
  __v: { type: Number, select: false },
});

module.exports = mongoose.model('pack', pack);
