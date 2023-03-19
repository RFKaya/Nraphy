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
  }

  //guilds
  if (Object.keys(client.databaseQueue.guilds).length) {
    for await (const [guildId, queueDatas] of Object.entries(client.databaseQueue.guilds)) {
      //guildId = "746357184211714089"
      /*queueDatas = { wordGame: { stats: ... } };*/

      (async function () {
        const guildData = await client.database.fetchGuild(guildId);
        let changedDataStatus = false;
        //let dataStatus_stats = false;

        for await (const [key, value] of Object.entries(queueDatas)) {
          //key = 'wordGame'
          //value = { stats: { userId: ... } }

          if (key == "wordGame") {

            for await (const [key, wordGameStats] of Object.entries(value)) {
              //key = 'stats'
              //wordGameStats = { userId: { wordCount: 5, wordLength, 21 } }

              if (key == "longestWord") {

                //Veri yoksa atla, varsa changedDataStatus'a true çek.
                if (!client.databaseQueue.guilds[guildId].wordGame.longestWord) continue;
                if (!changedDataStatus) changedDataStatus = true;

                //Verileri guildData'ya gönderme
                guildData.wordGame.longestWord = {
                  word: client.databaseQueue.guilds[guildId].wordGame.longestWord.word,
                  author: client.databaseQueue.guilds[guildId].wordGame.longestWord.author
                };

                //Gönderilen verileri önbellekten temizleme
                delete client.databaseQueue.guilds[guildId].wordGame.longestWord;

              }

              if (key == "history") {

                //Veri yoksa atla, varsa changedDataStatus'a true çek.
                if (!client.databaseQueue.guilds[guildId].wordGame.history?.length) continue;
                if (!changedDataStatus) changedDataStatus = true;

                //Verileri guildData'ya gönderme
                guildData.wordGame.history = guildData.wordGame.history
                  .concat(client.databaseQueue.guilds[guildId].wordGame.history)
                  .slice(-200);

                //Gönderilen verileri önbellekten temizleme
                delete client.databaseQueue.guilds[guildId].wordGame.history;

              }

              if (key == "lastWord") {

                //Veri yoksa atla, varsa changedDataStatus'a true çek.
                if (!client.databaseQueue.guilds[guildId].wordGame.lastWord) continue;
                if (!changedDataStatus) changedDataStatus = true;

                //Verileri guildData'ya gönderme
                guildData.wordGame.lastWord = {
                  word: client.databaseQueue.guilds[guildId].wordGame.lastWord.word,
                  author: client.databaseQueue.guilds[guildId].wordGame.lastWord.author
                };
                /*if (!guildData.wordGame.lastWord) guildData.wordGame.lastWord = {};
                guildData.wordGame.lastWord.word = client.databaseQueue.guilds[guildId].wordGame.lastWord.word;
                guildData.wordGame.lastWord.author = client.databaseQueue.guilds[guildId].wordGame.lastWord.author;*/

                //Gönderilen verileri önbellekten temizleme
                delete client.databaseQueue.guilds[guildId].wordGame.lastWord;

              }

              if (key == "stats") {

                for (const [statUserId, statValues] of Object.entries(wordGameStats)) {
                  //statUserId = 'userId'
                  //statValues = { wordCount: 5, wordLength, 21 }

                  //Veri yoksa atla, varsa changedDataStatus'a true çek.
                  if (!statValues.wordCount && !statValues.wordLength) continue;
                  if (!changedDataStatus) changedDataStatus = true;

                  //guildData'da ilgili veriler yoksa
                  guildData.wordGame.stats ||= {};
                  guildData.wordGame.stats[statUserId] ||= {};
                  guildData.wordGame.stats[statUserId].wordCount ||= 0;
                  guildData.wordGame.stats[statUserId].wordLength ||= 0;

                  //Verileri guildData'ya gönderme
                  guildData.wordGame.stats[statUserId].wordCount += statValues.wordCount;
                  guildData.wordGame.stats[statUserId].wordLength += statValues.wordLength;

                  //Gönderilen verileri önbellekten temizleme
                  client.databaseQueue.guilds[guildId].wordGame.stats[statUserId].wordCount -= statValues.wordCount;
                  client.databaseQueue.guilds[guildId].wordGame.stats[statUserId].wordLength -= statValues.wordLength;

                }

                if (!changedDataStatus) delete client.databaseQueue.guilds[guildId].wordGame.stats;

              }
            }

          } else if (key == "countingGame") {

            if (value.number) {

              //Veri varsa changedDataStatus'a true çek.
              if (!changedDataStatus) changedDataStatus = true;

              //guildData'da ilgili veriler yoksa
              guildData.countingGame.number = value.number;

              //Gönderilen verileri önbellekten temizleme
              delete client.databaseQueue.guilds[guildId].countingGame;

            };

          }

          if (changedDataStatus) {
            guildData.markModified('wordGame');
            await guildData.save(); //.then(console.log("new guildData saved"));
          }

        }
      })();
    }
  }

};