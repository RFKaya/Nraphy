const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  userId: { type: String, unique: true },
  registeredAt: { type: Number, default: Date.now },
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

});

schema.pre('save', async function () {
  //console.log("user schema - save event");
  //if (!this.userId) return;

  //let thisDoc = { ...this._doc };
  function funcName(client, { userId }) {
    delete global.localDatabase.users[userId];
  }
  global.client.shard.broadcastEval(funcName, { context: { userId: this.userId } });
  //global.database.usersCache[this.userId] = this;//{ ...global.databaseCache[this.userId], ...thisDoc };
});

module.exports = mongoose.model('user', schema);