const mongoose = require('mongoose'),
  clientDataSchema = require("./Schema/clientData.js"),
  guildSchema = require("./Schema/guilds.js"),
  userSchema = require("./Schema/users.js");

module.exports.clientData = clientDataSchema;
module.exports.guilds = guildSchema;
module.exports.users = userSchema;

//------------------------------Fetch Fonksiyonları------------------------------//
module.exports.fetchClientData = async function fetchClientData(date) {
  if (!date) {
    const nowDate = new Date();
    date = `${nowDate.getDate()}.${(nowDate.getMonth() + 1)}.${nowDate.getFullYear()}`;
  }

  return await clientDataSchema.findOne({ date: date }) || await clientDataSchema.create({ date: date });
};

module.exports.fetchGuild = async guildId =>
  global.localDatabase.guilds[guildId] ||
  await guildSchema.findOne({ guildId }).then(guildData => global.localDatabase.guilds[guildId] = guildData) ||
  await guildSchema.create({ guildId }).then(guildData => global.localDatabase.guilds[guildId] = guildData);

module.exports.fetchUser = async (userId) =>
  await userSchema.findOne({ userId }) || await userSchema.create({ userId });
module.exports.fetchUserInCache = async (userId) => {
  const userCacheData = await global.redis_users.get(userId);
  if (userCacheData)
    return JSON.parse(userCacheData);
  else return null;
};

module.exports.pushDatabaseQueue = async (client) => {

  //guilds
  client.guildsWaitingForSync.forEach(async guildId => {
    client.guildsWaitingForSync.splice(client.guildsWaitingForSync.indexOf(guildId), 1);
    await global.localDatabase.guilds[guildId].save();
    //client.logger.log(`${guildId} ID'li sunucu, database ile eşitlendi`, "log", false);
  });

};