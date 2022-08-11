const mongoose = require("mongoose");

module.exports = mongoose.model("user", new mongoose.Schema({

    userId: { type: String, unique: true },
    registeredAt: { type: Number, default: Date.now() },
    commandUses: { type: Number, default: 0 },
    readDateOfChanges: { type: Number, default: 0 },

    about: { type: String, default: null },
    comments: { type: Object, default: [] },

    NraphyCoin: { type: Number, default: 0 },
    NraphyPremium: { type: Number, default: null },
    USD: { type: Number, default: 0 },

    lastBonus: {
        type: Object, default: {
            lastStandardBonus: null,
            lastPremiumBonus: null,
        }
    },

    hunter: {
        type: Object, default: {
            level: 0
        }
    },

    topggVotes: {
        type: Object, default: {
            voteAmount: 0,
            lastVote: null,
            lastRemind: null
        }
    }

}));
