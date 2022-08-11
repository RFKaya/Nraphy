const mongoose = require("mongoose");

module.exports = mongoose.model("clientData", new mongoose.Schema({

    dataId: { type: Number, unique: true },
    registeredAt: { type: Number, default: Date.now() },

    commandUses: { type: Object, default: {} },
    cmd: { type: Number, default: 0 },
    interactionCmd: { type: Number, default: 0 },

    webPanel: {
        logins: { type: Number, default: 0 }
    },

    error: { type: Number, default: 0 },
    crash: { type: Number, default: 0 },

    //readersOfChanges: { type: Array, default: [] },

}, { collection: 'clientData' }));
