const mongoose = require('mongoose'),
  clientDataSchema = require("./Schema/clientData.js"),
  guildSchema = require("./Schema/guilds.js"),
  userSchema = require("./Schema/users.js"),
  humanize = require("humanize-duration"),
  { ButtonBuilder } = require('discord.js');

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

module.exports.fetchUser = async (userId, createIfNotExits = true/*requiredData = []*/) => {
  if (createIfNotExits) {
    return (Object.keys(global.localDatabase.users[userId] || {}).length && global.localDatabase.users[userId]) ||
      await userSchema.findOne({ userId }/*, requiredData*/).then(userData => global.localDatabase.users[userId] = userData) ||
      await userSchema.create({ userId }).then(userData => global.localDatabase.users[userId] = userData);
  } else {
    return global.localDatabase.users[userId]; /*||
      await userSchema.findOne({ userId }).then(userData => {
        if (userData)
          return global.localDatabase.users[userId] = userData;
        else return global.localDatabase.users[userId] = {};
      });*/
  }
};

module.exports.pushDatabaseQueue = async (client) => {

  //users
  if (Object.keys(client.databaseQueue.users).length) {
    for await (const [userId, queueDatas] of Object.entries(client.databaseQueue.users)) {
      //userId = "700385307077509180"
      //queueDatas = { statistics: { commandUses: 3 } };

      (async function () {
        //const userData = await client.database.fetchUser(userId);

        for (const [key, value] of Object.entries(queueDatas)) {
          //key = 'statistics'
          //value = { commandUses: 4 }

          if (key == "statistics") {

            for (const [statisticKey, statisticValue] of Object.entries(value)) {
              //statisticKey = 'commandUses'
              //statisticValue = 4

              if (statisticKey == "commandUses") {

                delete client.databaseQueue.users[userId];

                const userData = await client.database.fetchUser(userId);
                userData.statistics.commandUses += statisticValue;
                if (userData.commandUses) {
                  userData.statistics.commandUses += userData.commandUses;
                  userData.commandUses = undefined;
                }
                await userData.save();

              }
            }
          }
        }
      })();
    }
  };

  //guilds
  client.guildsWaitingForSync.forEach(async guildId => {
    client.guildsWaitingForSync.splice(client.guildsWaitingForSync.indexOf(guildId), 1);
    await global.localDatabase.guilds[guildId].save();
    client.logger.log(`${guildId} ID'li sunucu, database ile eşitlendi`, "log", false);
  });

};