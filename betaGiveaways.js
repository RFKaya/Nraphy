const mongoose = require("mongoose");

module.exports = mongoose.model("betaGiveaway", new mongoose.Schema({

   messageId: String,
   channelId: String,
   guildId: String,

   prize: String,
   winnerCount: Number,

   startAt: Number,
   duration: Number,
   isEnded: Boolean,

   winners: { type: [String], default: [] },

   hoster: String,

}));