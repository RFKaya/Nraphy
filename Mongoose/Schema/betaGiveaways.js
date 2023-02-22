const mongoose = require("mongoose");

module.exports = mongoose.model("betaGiveaway", new mongoose.Schema({

  messageId: String,
  channelId: String,
  guildId: String,

  prize: String,
  winnerCount: Number,

  startAt: Number,
  duration: Number,
  isPaused: Boolean,
  isEnded: Boolean,

  winners: { type: [String], default: [] },
  rerolls: { type: [String], default: [] },

  hoster: String,

  isDrop: { type: Boolean, default: false }

}));