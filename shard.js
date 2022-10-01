const { ShardingManager, WebhookClient } = require('discord.js');
const db = require("quick.db");

const config = require("./config.json");
const logger = require("./modules/Logger.js");

//const nowDate = new Date();
//const clientDataId = `${nowDate.getDate()}.${(nowDate.getMonth() + 1)}.${nowDate.getFullYear()}`;

const manager = new ShardingManager('./client.js', {

  totalShards: config.totalShards, //'auto',

  respawn: true,

  token: config.token,

  execArgv: ["client.js"/*, clientDataId*/]

});

manager.on('shardCreate', (shard) => {

  logger.shard(`Shard ${shard.id + 1} is starting...`);

  shard.on('death', () => logger.error(`Shard ${shard.id + 1} death eventi yolladı!`));
  shard.on("disconnect", (event) => logger.error(event));
  shard.on('ready', () => logger.ready(`Shard ${shard.id + 1} is now up and running!`));
  shard.on('error', (err) => logger.error(`Shard ${shard.id + 1}'de sıkıntı cıktı hocisim!: \n` + (err.message ? err.message : err)));

});

try {
  logger.client(`Loading Client...`);
  manager.spawn({ timeout: 300000 });
} catch (e) {
  console.log(e);
}

//------------------------------TOP.GG İstatistik------------------------------//

//RAUF ABİ NOTU: TOPGG token girdiğinizde burayı açabilirsiniz.

/*const { AutoPoster } = require('topgg-autoposter')

const poster = AutoPoster(config.topggToken, manager)

poster.on('posted', (stats) => {
    logger.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
})*/

//------------------------------TOP.GG İstatistik------------------------------//

//------------------------------Database Yedeği------------------------------//

setInterval(function () {

  const fs = require('fs');

  let dizin = `./backups/${Date.now()}.json.sqlite`;

  fs.copyFile('json.sqlite', dizin, (err) => {
    if (err) throw err;
    logger.log('Database yedeği alındı!');
  });

  //Optional
  /*let logChannelWebhookClient = new WebhookClient({ url: 'https://canary.discord.com/api/webhooks/...' });
  logChannelWebhookClient.send({
    embeds: [
      {
        color: client.settings.embedColors.green,
        title: "**»** Database Yedeği Başarıyla Alındı!",
        description: `**•** Dizin: ${dizin}\n**•** Sadece rauf abimin anlayacağı bilgi: ${guilds.length}`
      }
    ]
  });*/

}, 86400000); //86400000 (24 saat) - 43200000 (12 saat) 

//------------------------------Database Yedeği------------------------------//