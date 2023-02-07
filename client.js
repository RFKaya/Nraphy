const { Client, GatewayIntentBits, Options } = require('discord.js');
const Discord = require('discord.js');
const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);

const client = new Client({
  intents:
    [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildScheduledEvents
    ],
  failIfNotExists: false,
  restRequestTimeout: 60000
  /*sweepers: {
    ...Options.DefaultSweeperSettings,
    threads: {
      interval: 3600,
      lifetime: 10800
    },
    messages: {
      interval: 3600, // Every hour...
      lifetime: 7200,	// Remove messages older than 30 minutes.
    },
  },*/
});

const interactionCommands = [];

client.userDataCache = {};
client.guildDataCache = {};

client.guildInvites = new Map();
client.gamesPlaying = new Map();
client.usersMap = new Map();
client.warnsMap = new Map();

//------------------------------Ayarlar------------------------------//

client.settings = {
  presence: "Nraphy!",
  prefix: "n!",
  owner: "700385307077509180",
  icon: "https://cdn.discordapp.com/attachments/801418986809589771/975048501912272997/Narpitti.png",
  embedColors: {
    default: 0xEB1C5A,
    green: 0x2ECC71,
    red: 0xE74C3C,
    yellow: 0xFEE75C,
    blue: 0x3498DB,
  },
  language: "tr",
  invite: "https://discord.com/oauth2/authorize?client_id=700959962452459550&permissions=8&redirect_uri=https://discord.gg/VppTU9h&scope=applications.commands%20bot&response_type=code"
};

//------------------------------Ayarlar------------------------------//

//------------------------------Kurulum------------------------------//

/*setInterval(function () {
  process.send({ qurve: true, anivi: false });
}, 1000);*/

client.events = new Discord.Collection();
client.commands = new Discord.Collection();
client.logger = require("./modules/Logger.js");
client.date = require("./modules/Date.js");
//client.userFetcher = require("./modules/userFetcher.js");
client.config = require("./config.json");
client.listGuilds = async function () {
  const guilds = [];
  const guildsArray = await client.shard.broadcastEval(c => c.guilds.cache);
  for (const guild of guildsArray)
    guild.forEach(g => guilds.push(g.id));
  return guilds;
};
client.capitalizeFirstLetter = ([first, ...rest], locale = "tr-TR") => first.toLocaleUpperCase(locale) + rest.join('');
client.wait = ms => new Promise(res => setTimeout(res, ms));
client.removeConsecutiveDuplicates = function removeConsecutiveDuplicates(input) {
  if (input.length <= 1)
    return input;
  if (input[0] == input[1])
    return removeConsecutiveDuplicates(input.substring(1));
  else
    return input[0] +
      removeConsecutiveDuplicates(input.substring(1));
};
client.getRandom = function getRandom(arr, n) {
  let len = arr.length;
  if (n > len) n = len;
  let result = new Array(n),
    taken = new Array(len);
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

async function startUp() {

  //Starting all events
  let eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
  //client.logger.load(`Loading Events...`)
  for (let eventFile of eventFiles) {
    let event = require(`./events/${eventFile}`);
    let eventName = eventFile.split(".")[0];
    //client.logger.event(`Loading Event: ${eventName}`);
    client.on(eventName, event.bind(null, client));
  }
  //client.logger.event(`Events Loaded!`)

  //Load all the commands
  let commandCategories = await readdir("./commands/");
  //client.logger.load(`Loading Commands...`)
  commandCategories.forEach(commandCategory => {
    fs.readdir(`./commands/${commandCategory}/`, (err, commandCategoryFiles) => {
      if (err) console.error(err);
      //console.log(`${files.length} command will be loaded.`);
      for (let commandFile of commandCategoryFiles) {
        let command = require(`./commands/${commandCategory}/${commandFile}`);
        //console.log(`Loaded command: ${command.name}`);
        client.commands.set(command.interaction ? command.interaction.name : command.name, command);
        if (command.interaction)
          interactionCommands.push(command.interaction);
      };
    });
  });

  //client.logger.load(`Commands Loaded!`)

  //---------------Mongoose Database---------------//
  const mongoose = require('mongoose');
  client.database = require('./Mongoose/Mongoose.js');
  mongoose.set("strictQuery", false);
  mongoose.connect(client.config.mongooseToken, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    //client.logger.log('Connected to MongoDB');
  }).catch((err) => {
    console.log('Unable to connect to MongoDB Database.\nError: ' + err);
  });

  //Database Queue
  //client.databaseCache = {};//process.argv[4];
  client.databaseQueue = { users: {}, guilds: {}, client: {} };
  setInterval(() => {

    //users
    if (Object.keys(client.databaseQueue.users).length) {
      for (const [userId, queueDatas] of Object.entries(client.databaseQueue.users)) {
        //userId = "700385307077509180"
        //queueDatas = { statistics: { commandUses: 3 } };

        (async function () {
          const userData = await client.database.fetchUser(userId);

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
      for (const [guildId, queueDatas] of Object.entries(client.databaseQueue.guilds)) {
        //guildId = "746357184211714089"
        /*queueDatas = { wordGame: { stats: ... } };*/

        (async function () {
          const guildData = await client.database.fetchGuild(guildId);
          let changedDataStatus = false;
          //let dataStatus_stats = false;

          for (const [key, value] of Object.entries(queueDatas)) {
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

  }, 60000);

  await client.login(client.config.token);
}

startUp();

client.on("ready", async () => {

  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v9');

  const rest = new REST({ version: '9' }).setToken(client.config.token);
  await rest.put(Routes.applicationCommands(client.user.id), { body: interactionCommands });

});

client.on("disconnect", () => client.logger.error("Bot is disconnecting..."));
client.on("reconnecting", () => client.logger.error("Bot reconnecting..."));
client.on("error", (e) => client.logger.error(e));
client.on("warn", (info) => client.logger.error(info)); //client.logger.error(info, "warn"));
//client.on("debug", (log) => client.logger.debug(log))
//client.on("raw", r => { if (r.t !== "PRESENCE_UPDATE") client.logger.debug(r.t) })
//client.player.on("debug", r => console.log(r)) 

client.on('shardError', error => {
  console.error('A websocket connection encountered an error:', error);
  client.logger.error(error);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  client.logger.error(err);
});
process.on('uncaughtException', (err) => {
  //console.error(err);
  client.logger.error(err);
});

//process.setMaxListeners(0);

//require('events').EventEmitter.prototype._maxListeners = 100;

//------------------------------Kurulum------------------------------//

//------------------------------Müzik------------------------------//

const { Player, QueryType } = require("discord-player");
//const playdl = require("play-dl");
//const extractor = require("./utils/extractor.js");

client.player = new Player(client,
  {
    searchEngine: QueryType.AUTO,
    ytdlOptions: {
      filter: 'audioonly',
      //quality: 'highestaudio',
      //highWaterMark: 1 << 25
    }
  }
);
//client.player.use("dodong", extractor);
/*client.filters = ['bassboost', '8D', 'vaporwave', 'nightcore', 'phaser', 'tremolo', 'vibrato', 'reverse', 'treble', 'normalizer', 'surrounding', 'pulsator', 'subboost',
  'kakaoke', 'flanger', 'gate', 'haas', 'mcompand', 'mono', 'mstlr', 'mstrr', 'compressor', 'expander', 'softlimiter', 'chorus', 'chorus2d', 'chorus3d', 'fadein'];*/

/*playdl.getFreeClientID().then((clientID) => {
  playdl.setToken({
    soundcloud: { client_id: clientID }
  });
});*/

const playerFiles = fs.readdirSync('./events/player/').filter(file => file.endsWith('.js'));
for (const eventFile of playerFiles) {
  const event = require(`./events/player/${eventFile}`);
  const eventName = eventFile.split(".")[0];
  //client.logger.event(`Loading Event: ${eventName}`);
  client.player.on(eventName, event.bind(null, client));
}

//------------------------------Müzik------------------------------//

String.prototype.toEN = function () {
  return this//UPPERS:     // LOWERS:
    .replaceAll("Ğ", "G").replaceAll("ğ", "g")
    .replaceAll("Ü", "U").replaceAll("ü", "u")
    .replaceAll("Ş", "S").replaceAll("ş", "s")
    .replaceAll("İ", "I").replaceAll("ı", "i")
    .replaceAll("Ö", "O").replaceAll("ö", "o")
    .replaceAll("Ç", "C").replaceAll("ç", "c");
};