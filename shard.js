const { ShardingManager } = require('discord.js');
const fs = require("fs");
const config = require("./config.json");

if (!config.mongooseToken)
  return logger.error('config.json\'da \'mongooseToken\' değeri bulunamadı. Hatalarla karşılaşmamak için lütfen doğru biçimde mongooseToken değerini doldurun.');

const manager = new ShardingManager('./client.js', {

  totalShards: 'auto',

  respawn: true,

  token: config.token,

  execArgv: [/*"--inspect", "--max-old-space-size=2048", "--trace-warnings",*/ "client.js"/*, clientDataId*/],

});

//------------------------------Logger------------------------------//
const logger = require("./modules/Logger.js"),
  logsFolder = './logs';
if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder);
  logger.warn("Logs folder could not be found! The folder was created automatically.");
}

//------------------------------Shard Create------------------------------//
manager.on('shardCreate', (shard) => {
  //logger.shard(`Shard ${shard.id + 1} is starting...`);

  shard.on('death', () => logger.warn(`Shard ${shard.id + 1} death eventi yolladı!`));
  shard.on("disconnect", (event) => logger.error(event));
  //shard.on('ready', () => logger.ready(`Shard ${shard.id + 1} is now up and running!`));
  shard.on('error', (err) => logger.error(`Shard ${shard.id + 1}'de sıkıntı cıktı hocisim!: \n` + (err.message ? err.message : err)));
});

try {
  logger.client(`Loading Client...`);
  manager.spawn({ timeout: 180000 })
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