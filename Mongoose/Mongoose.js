const clientDataSchema = require("./Schema/clientData.js"),
  guildSchema = require("./Schema/guilds.js"),
  userSchema = require("./Schema/users.js"),
  giveawaySchema = require("./Schema/giveaways.js"),
  betaGiveawaySchema = require("./Schema/betaGiveaways.js");

module.exports.clientData = clientDataSchema;
module.exports.guilds = guildSchema;
module.exports.users = userSchema;
module.exports.giveaways = giveawaySchema;
module.exports.betaGiveaways = betaGiveawaySchema;

//------------------------------Fetch Fonksiyonları------------------------------//
module.exports.fetchClientData = async function fetchClientData(date) {
  if (!date) {
    const nowDate = new Date();
    date = `${nowDate.getDate()}.${(nowDate.getMonth() + 1)}.${nowDate.getFullYear()}`;
  }

  return await clientDataSchema.findOne({ date: date }) || await clientDataSchema.create({ date: date });
};

module.exports.fetchGuild = async guildId =>
  await guildSchema.findOne({ guildId }) ||
  await guildSchema.create({ guildId });

module.exports.fetchUser = async (userId, requiredData = []) =>
  await userSchema.findOne({ userId }, requiredData) ||
  await userSchema.create({ userId });

module.exports.fetchBetaGiveaway = async messageId =>
  await betaGiveawaySchema.findOne({ messageId });