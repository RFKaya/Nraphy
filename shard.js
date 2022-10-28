const { ShardingManager, WebhookClient } = require('discord.js');
const db = require("quick.db");

const config = require("./config.json");
const logger = require("./modules/Logger.js");

if (!config.mongooseToken)
  return logger.error('config.json\'da \'mongooseToken\' değeri bulunamadı. Hatalarla karşılaşmamak için lütfen doğru biçimde mongooseToken değerini doldurun.');

const manager = new ShardingManager('./client.js', {

  totalShards: 'auto',

  respawn: true,

  token: config.token,

  execArgv: ["--trace-warnings", "client.js"],

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
  manager.spawn({ timeout: 300000 })
    /*.then(shards => {
      shards.forEach(shard => {
        shard.on('message', message => {
          console.log(message);
        });
      });
    })*/
    .catch(logger.error);
} catch (e) {
  console.log(e);
}

//------------------------------TOP.GG İstatistik------------------------------//

if (config.topggToken) {

  // Connect to Mongoose
  const mongoose = require('mongoose');
  const Mongoose = require("./Mongoose/Mongoose.js");
  mongoose.connect(config.mongooseToken, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    //client.logger.log('Connected to MongoDB');
  }).catch((err) => {
    console.log('Unable to connect to MongoDB Database.\nError: ' + err);
  });

  const { AutoPoster } = require('topgg-autoposter');
  const poster = AutoPoster(config.topggToken, manager);

  poster.on('posted', (stats) => {
    (async () => {
      var clientData = await Mongoose.fetchClientData();
      clientData.guildCount = stats.serverCount;
      await clientData.save();
    })();

    logger.log(`Top.gg & Database stats updated! | ${stats.serverCount} servers`);
  });

}

//------------------------------TOP.GG İstatistik------------------------------//