const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  userId: { type: String, unique: true },
  registeredAt: { type: Number, default: Date.now },
  blacklist: {
    status: Boolean,
    reason: String
  },
  readDateOfChanges: { type: Number, default: 0 },

  about: { type: String, default: null },
  comments: [
    {
      user: String,
      date: Number,
      comment: String,
      id: Number,
    }
  ],

  NraphyCoin: { type: Number, default: 0, get: Math.floor },
  NraphyPremium: { type: Number, default: null },
  NraphyBoost: Array,
  hunter: {
    level: Number,
    name: String,
    commands: [Object]
  },

  commandUses: Number, //{ type: Number, default: 0 },
  statistics: {
    commandUses: { type: Number, default: 0 },
    bannedUsers: { type: Number, default: 0 },
    kickedUsers: { type: Number, default: 0 },
    jackpot: { //{ type: Number, default: 0 },
      uses: { type: Number, default: 0 },
      totalBetNC: { type: Number, default: 0 },
      earnedNC: { type: Number, default: 0 },
      lostNC: { type: Number, default: 0 }
    }
  },

  AFK: {
    time: Date,
    reason: String,
  },

  lastBonus: {
    lastStandardBonus: Date,
    lastPremiumBonus: Date,
  },

  topggVotes: {
    voteAmount: { type: Number, default: 0 },
    lastVote: { type: Date, default: null },
    lastRemind: { type: Date, default: null }
  }

}/* , { timestamps: true } */);

schema.pre('save', async function () {
  //console.log("user schema - save event");
  //if (!this.userId) return;

  /* global.client.shard.broadcastEval(async function updateDatabaseUser(client, { userId }) {
    //delete global.localDatabase.users[userId];
    if (global.localDatabase.users[userId])
      global.localDatabase.users[userId] = await client.database.users.findOne({ userId });
  }, { context: { userId: this.userId } }); */
  //global.database.usersCache[this.userId] = this;//{ ...global.databaseCache[this.userId], ...thisDoc };

  await global.redis_users.set(this.userId, JSON.stringify(this));
});

module.exports = mongoose.model('user', schema);