const clientDataSchema = require("./Schema/clientData.js");
const guildSchema = require("./Schema/guilds.js");
const userSchema = require("./Schema/users.js");
const giveawaySchema = require("./Schema/giveaways.js");
const betaGiveawaySchema = require("./Schema/betaGiveaways.js");

module.exports.clientData = clientDataSchema;
module.exports.guilds = guildSchema;
module.exports.users = userSchema;
module.exports.giveaways = giveawaySchema;
module.exports.betaGiveaways = betaGiveawaySchema;

module.exports.fetchClientData = async dataId => await clientDataSchema.findOne({ dataId });
module.exports.fetchGuild = async guildId => await guildSchema.findOne({ guildId }) || await guildSchema.create({ guildId });
module.exports.fetchUser = async userId => await userSchema.findOne({ userId }) || await userSchema.create({ userId });
module.exports.fetchBetaGiveaway = async messageId => await betaGiveawaySchema.findOne({ messageId });