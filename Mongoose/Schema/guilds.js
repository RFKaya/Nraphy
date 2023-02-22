const { IntegrationExpireBehavior } = require("discord.js");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  guildId: { type: String, unique: true },
  registeredAt: { type: Number, default: Date.now() },

  //Nraphy Verileri
  prefix: { type: String, default: "n!" },
  NraphyBoost: Date,
  NraphyLogs: {
    type: [Object]
  },

  //Sunucu Ayarları
  autoReply: Boolean,

  autoRole: {
    role: String,
    channel: String,
    setupChannel: String
  },

  buttonRole: Object,

  campaignNews: String,

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

  tempChannels: String,

  warns: Object,

  //Oyunlar
  countingGame: {
    channel: String,
    number: Number,
    setupChannel: String
  },

  wordGame: {
    channel: String,
    setupChannel: String,
    lastWord: { word: String, author: String },
    writeMore: Boolean,
    stats: Object,
    longestWord: { word: String, author: String },
    history: [String]
  },

});

schema.pre('save', async function () {
  //console.log("guild schema - save event");

  //global.database.guildsCache[this.guildId] = this;
  function funcName(client, { guildId }) {
    delete global.database.guildsCache[guildId];
  }
  global.client.shard.broadcastEval(funcName, { context: { guildId: this.guildId } });
});

module.exports = mongoose.model('guild', schema);