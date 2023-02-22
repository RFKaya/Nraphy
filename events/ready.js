const db = require("quick.db"),
  tcpPortUsed = require('tcp-port-used'),
  { ButtonBuilder, WebhookClient } = require('discord.js'),
  topgg = require(`@top-gg/sdk`),
  random = require("random");

module.exports = async (client) => {

  client.logger.ready(`Client ready in shard ${client.shard.ids[0] + 1}!`);

  global.client = client;

  try {

    //------------------------------Mongoose------------------------------//

    await require('../Mongoose/Mongoose').prepareMongoose(client);

    //------------------------------Mongoose------------------------------//


    //------------------------------Oynuyor------------------------------//

    await client.user.setPresence({
      activities: [{
        name: client.settings.presences[0],
        type: 2, //5
      }],
      //status: "online", //online, idle, dnd
    });//.catch(console.error);

    //------------------------------Oynuyor------------------------------//

    //------------------------------Presence Yenileme & Otomatik Yeniden Başlatmalar------------------------------//

    setInterval(async function () {

      //Otomatik Yeniden Başlatma (Bağlantı Problemine Göre)
      if (
        !client.ws.shards.values().next().value.sessionId ||
        client.ws.shards.values().next().value.sequence === -1 ||
        client.ws.shards.values().next().value.sequence === null
      ) {
        client.logger.warn("SHARD ÜZERİNDE BAĞLANTI HATASI OLUŞTUĞU İÇİN YENİDEN BAŞLATILIYOR!");
        process.exit();
      }

      //Otomatik Yeniden Başlatma (RAM Kullanımına Göre)
      let dateHours = new Date().getHours();
      if (dateHours >= 4 && dateHours <= 6
        && process.memoryUsage().rss > 2500000000
        && (!client.voice.adapters.size || !client.distube.queues.size)
      ) {
        await client.logger.warn(`SHARD BAŞINA RAM KULLANIMI 2,5 GB'ı AŞTIĞI İÇİN SHARD YENİDEN BAŞLATILIYOR!\n\n` +
          `client.voice.adapters.size: ${client.voice.adapters.size}\n` +
          `client.distube.queues.size: ${client.distube.queues.size}`
        );
        process.exit(0);
      }

      //Bot Durum
      let randomPresence = client.settings.presences[Math.floor(Math.random() * client.settings.presences.length)];
      /*if (!client.user?.presence?.activities[0]?.name)*/ client.user.setPresence({
        activities: [{
          name: randomPresence,
          type: 2
        }],
        //status: "online", //online, idle, dnd
      });//.catch(console.error);

    }, 600000);

    setTimeout(function () {
      if (!client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)) {
        client.logger.warn("SHARD SORUNLU OLARAK BAŞLATILDIĞI İÇİN YENİDEN BAŞLATILIYOR!");
        process.exit(0);
      };
    }, 300000);

    //------------------------------Presence Yenileme & Otomatik Yeniden Başlatmalar------------------------------//

    //------------------------------Bot İstatistik------------------------------//

    /*var clientData = await client.database.fetchClientData(global.clientDataId);
    clientData.crash += 1;
    clientData.markModified('crash');
    await clientData.save();*/

    //------------------------------Bot İstatistik------------------------------//

    //------------------------------Davet Sistemi------------------------------//

    client.guilds.cache.forEach(guild => {

      //Davet Sistemi açıksa && "ManageGuild" yetkim varsa
      const inviteManager = db.fetch(`guilds.${guild.id}.inviteManager`);
      if (inviteManager && inviteManager.channel && guild.members.cache.get(client.user.id).permissions.has("ManageGuild")) {

        guild.invites.fetch().then(invites => {
          const codeUses = new Map();
          invites.each(inv => codeUses.set(inv.code, inv.uses));
          client.guildInvites.set(guild.id, codeUses);

        }).catch(err => {
          client.logger.error("OnReady Error:", err);
        });

      }

    });

    //------------------------------Davet Sistemi------------------------------//

  } catch (err) { client.logger.error(err); };
};
