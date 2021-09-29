const mongoose = require('mongoose');

const pack = new mongoose.Schema({
  cardsPerType: [{ tokenType: Number, tokensToMint: Number }],
  price: { type: Number, min: 1 },
  __v: { type: Number, select: false },
});

module.exports = mongoose.model('pack', pack);
