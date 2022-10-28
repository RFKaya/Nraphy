const mongoose = require("mongoose");

module.exports = mongoose.model("clientData", new mongoose.Schema({

    date: { type: String, unique: true },

    commandUses: { type: Object, default: {} },
    //cmd: { type: Number, default: 0 },
    //interactionCmd: { type: Number, default: 0 },

    /*webPanel: {
        logins: { type: Number, default: 0 }
    },*/

    error: { type: Number, default: 0 },
    //crash: { type: Number, default: 0 },

    guildCount: Number

}, { collection: 'clientData' }));