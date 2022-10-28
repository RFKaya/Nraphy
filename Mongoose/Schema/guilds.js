const mongoose = require("mongoose");

module.exports = mongoose.model("guild", new mongoose.Schema({

  guildId: { type: String, unique: true },
  registeredAt: { type: Number, default: Date.now() },

  //Nraphy Verileri
  prefix: { type: String, default: "n!" },
  NraphyLogs: {
    type: [Object]
  },

  //Moderasyon
  autoReply: Boolean,

  autoRole: {
    role: String,
    channel: String,
    setupChannel: String

  },

  buttonRole: Object,

  gallery: String,

  inviteManager: {
    channel: String,
    setupChannel: String,
    invites: [String]
  },

  linkBlock: {
    guild: Boolean,
    channels: [String],
    exempts: { channels: [String], roles: [String] }

  },

  logger: {
    webhook: String
  },

  memberCounter: {
    target: Number,
    channel: String,
    setupChannel: String
  },

  spamProtection: {
    guild: Boolean,
    channels: [String],
    exempts: { channels: [String], roles: [String] }
  },

  /*starboard: {
    type: Object, default: {
        channel: null,
        messages: {},
        exempts: { channels: [] }
    }
  },*/

  upperCaseBlock: {
    guild: Boolean,
    channels: [String],
    exempts: { channels: [String], roles: [String] },
    rate: { type: Number, default: 70 }
  },

  warns: Object,

  //Oyunlar
  countingGame: {
    channel: String,
    number: { type: Number, default: 0},
    setupChannel: String
  },

  wordGame: {
    channel: String,
    lastWord: String,
    setupChannel: String,
    stats: Object

  },

}));