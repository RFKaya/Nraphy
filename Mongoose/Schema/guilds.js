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
    autoReply: { type: Boolean, default: false },

    autoRole: {
        type: Object, default: {
            role: null,
            channel: null,
            setupChannel: null
        }
    },

    buttonRole: {
        type: Object, default: {}
    },

    inviteManager: {
        type: Object, default: {
            channel: false,
            setupChannel: null,
            invites: []
        }
    },

    linkBlock: {
        type: Object, default: {
            guild: false,
            channels: [],
            exempts: { channels: [], roles: [] }
        }
    },

    logger: {
        type: Object, default: {
            webhook: null
        }
    },

    memberCounter: {
        type: Object, default: {
            target: null,
            channel: null,
            setupChannel: null
        }
    },

    spamProtection: {
        type: Object, default: {
            guild: false,
            channels: [],
            exempts: { channels: [], roles: [] }
        }
    },

    warns: {
        type: Object, default: {}
    },

    //Oyunlar
    countingGame: {
        type: Object, default: {
            channel: null,
            number: 0,
            setupChannel: null
        }
    },
    wordGame: {
        type: Object, default: {
            channel: null,
            lastWord: null,
            setupChannel: null,
            stats: {}
        }
    },

}));
