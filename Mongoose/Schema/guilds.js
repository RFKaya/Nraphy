const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  guildId: { type: String, unique: true },
  registeredAt: { type: Number, default: Date.now },

  //Nraphy Verileri
  prefix: String,
  NraphyBoost: {
    users: Array
  },
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

  gallery: {
    channels: Array,
    autoCreateThreads: Boolean
  },

  inviteManager: {
    channel: String,
    setupChannel: String,
    invites: Object
  },

  linkBlock: {
    guild: Boolean,
    channels: [String],
    exempts: { channels: [String], roles: [String] }
  },

  logger: {
    webhook: String,
    smartFilters: Boolean
  },

  memberCounter: {
    target: Number,
    channel: String,
    setupChannel: String
  },

  memberStats: Object,

  mentionSpamBlock: {
    autoModerationRuleId: String
  },

  nameClearing: Boolean,

  spamProtection: {
    guild: Boolean,
    channels: [String],
    exempts: { channels: [String], roles: [String] }
  },

  stickyRoles: {
    status: Boolean,
    members: Object
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
  wordGame: {
    channel: String,
    setupChannel: String,
    lastWord: { word: String, author: String },
    writeMore: Boolean,
    stats: Object,
    longestWord: { word: String, author: String },
    history: [String]
  },

  countingGame: {
    channel: String,
    number: Number,
    lastUserId: String,
    writeMore: Boolean,
    setupChannel: String
  },

  correctIncorrectGame: {
    channelId: String,
    setupChannel: String,
    stats: Object,
    lastUserId: String,
    writeMore: Boolean,
  },

});

schema.pre('save', async function () {
  //console.log("guild schema - save event");

  global.client.shard.broadcastEval(async function updateDatabaseGuild(client, { guildId }) {
    client.guildsWaitingForSync.splice(client.guildsWaitingForSync.indexOf(guildId), 1);
    delete global.localDatabase.guilds[guildId];
  }, { context: { guildId: this.guildId } });
});

module.exports = mongoose.model('guild', schema);