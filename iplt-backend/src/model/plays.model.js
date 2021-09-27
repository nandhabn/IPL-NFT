const mongoose = require('mongoose');

const play = new mongoose.Schema({
  url: String,
  tokenType: Number,
  playID: Number,
  count: { type: Number, default: 0 },
  __v: { type: Number, select: false },
});

module.exports = mongoose.model('play', play);
