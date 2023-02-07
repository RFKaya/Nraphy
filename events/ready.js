const db = require("quick.db"),
  tcpPortUsed = require('tcp-port-used'),
  { ButtonBuilder, WebhookClient } = require('discord.js'),
  topgg = require(`@top-gg/sdk`),
  random = require("random");

module.exports = async (client) => {

  client.logger.ready(`Client ready in shard ${client.shard.ids[0] + 1}!`);

  global.database = { guildsCache: {}, usersCache: {} };
  global.client = client;

  try {

    //------------------------------Oynuyor------------------------------//

    client.user.setPresence({
      activities: [{
        name: client.settings.presence,
        type: 5, //LISTENING - WATCHING - PLAYING - STREAMING
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
        && (!client.voice.adapters.size || !client.player.queues.size)
      ) {
        await client.logger.warn(`SHARD BAŞINA RAM KULLANIMI 2,5 GB'ı AŞTIĞI İÇİN SHARD YENİDEN BAŞLATILIYOR!\n\n` +
          `client.voice.adapters.size: ${client.voice.adapters.size}\n` +
          `client.player.queues.size: ${client.player.queues.size}`
        );
        process.exit(0);
      }

      //Bot Durum
      /*if (!client.user?.presence?.activities[0]?.name)*/ client.user.setPresence({
        activities: [{
          name: client.settings.presence,
          type: 5
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

  } catch (err) { client.logger.error(err); };
};
