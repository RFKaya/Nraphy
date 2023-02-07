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
  global.database.guildsCache[guildId] ||
  await guildSchema.findOne({ guildId }).then(guildData => global.database.guildsCache[guildId] = guildData) ||
  await guildSchema.create({ guildId }).then(guildData => global.database.guildsCache[guildId] = guildData);

module.exports.fetchUser = async (userId, createIfNotExits = true/*requiredData = []*/) => {
  if (createIfNotExits) {
    return (Object.keys(global.database.usersCache[userId] || {}).length && global.database.usersCache[userId]) ||
      await userSchema.findOne({ userId }/*, requiredData*/).then(userData => global.database.usersCache[userId] = userData) ||
      await userSchema.create({ userId }).then(userData => global.database.usersCache[userId] = userData);
  } else {
    return global.database.usersCache[userId] ||
      await userSchema.findOne({ userId }).then(userData => {
        if (userData)
          return global.database.usersCache[userId] = userData;
        else return global.database.usersCache[userId] = {};
      });
  }
};

/*module.exports.fetchUserInCache = async (userId) =>
  global.databaseCache[userId] ||
  await userSchema.findOne({ userId }).then(userData => global.databaseCache[userId] = userData);*/

module.exports.fetchBetaGiveaway = async messageId =>
  await betaGiveawaySchema.findOne({ messageId });