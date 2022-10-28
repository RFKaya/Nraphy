const { Client, GatewayIntentBits, Options } = require('discord.js');
const Discord = require('discord.js');
const fs = require("fs");
const db = require("quick.db");
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
  presence: "❤️ /komutlar • /aşk-ölçer",
  prefix: "n!",
  owner: "700385307077509180",
  icon: "https://cdn.discordapp.com/attachments/801418986809589771/975048501912272997/Narpitti.png",
  embedColors: {
    default: 0xEB1C5A, //"eb1c5a" (Nraphy), "00ffb8" (Test),
    green: 0x2ECC71,
    red: 0xE74C3C,
    yellow: 0xFEE75C,
    blue: 0x3498DB,
  },
  language: "tr",
  invite: "https://discord.com/oauth2/authorize?client_id=700959962452459550&permissions=8&redirect_uri=https://discord.gg/VppTU9h&scope=applications.commands%20bot&response_type=code",
  webPanel: { //This is useless
    "clientSecret": "",
    "domain": "",
    "clientIP": "",
    "port": 0000,
    "customDomain": false,
  },
  updateDate: 1663505474594
};

//------------------------------Ayarlar------------------------------//

//------------------------------Kurulum------------------------------//

client.events = new Discord.Collection();
client.commands = new Discord.Collection();
client.logger = require("./modules/Logger.js");
client.date = require("./modules/Date.js");
//client.userFetcher = require("./modules/userFetcher.js");
client.config = require("./config.json");
client.databaseCache = process.argv[4];
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

  // Connect to Mongoose
  const mongoose = require('mongoose');
  client.database = require('./Mongoose/Mongoose.js');
  mongoose.connect(client.config.mongooseToken, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    //client.logger.log('Connected to MongoDB');
  }).catch((err) => {
    console.log('Unable to connect to MongoDB Database.\nError: ' + err);
  });

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
  console.error(err);
  client.logger.error(err);
});

//process.setMaxListeners(0);

//require('events').EventEmitter.prototype._maxListeners = 100;

//------------------------------Kurulum------------------------------//

//------------------------------Müzik------------------------------//

const { Player, QueryType } = require("discord-player");
const playdl = require("play-dl");
const extractor = require("./utils/extractor.js");

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
client.player.use("dodong", extractor);
/*client.filters = ['bassboost', '8D', 'vaporwave', 'nightcore', 'phaser', 'tremolo', 'vibrato', 'reverse', 'treble', 'normalizer', 'surrounding', 'pulsator', 'subboost',
  'kakaoke', 'flanger', 'gate', 'haas', 'mcompand', 'mono', 'mstlr', 'mstrr', 'compressor', 'expander', 'softlimiter', 'chorus', 'chorus2d', 'chorus3d', 'fadein'];*/

const playerFiles = fs.readdirSync('./events/player/').filter(file => file.endsWith('.js'));
for (const eventFile of playerFiles) {
  const event = require(`./events/player/${eventFile}`);
  const eventName = eventFile.split(".")[0];
  //client.logger.event(`Loading Event: ${eventName}`);
  client.player.on(eventName, event.bind(null, client));
}

playdl.getFreeClientID().then((clientID) => {
  playdl.setToken({
    soundcloud: { client_id: clientID }
  });
});

//------------------------------Müzik------------------------------//

//------------------------------Presence Yenileme------------------------------//

setInterval(() => {

  //Bot Durum
  client.user.setPresence({
    activities: [{
      name: client.settings.presence,
      type: 5, //LISTENING - WATCHING - PLAYING - STREAMING
    }],
    //status: "online", //online, idle, dnd
  });//.catch(console.error);

}, 3600000);

//------------------------------Presence Yenileme------------------------------//

String.prototype.toEN = function () {
  return this//UPPERS:     // LOWERS:
    .replaceAll("Ğ", "G").replaceAll("ğ", "g")
    .replaceAll("Ü", "U").replaceAll("ü", "u")
    .replaceAll("Ş", "S").replaceAll("ş", "s")
    .replaceAll("İ", "I").replaceAll("ı", "i")
    .replaceAll("Ö", "O").replaceAll("ö", "o")
    .replaceAll("Ç", "C").replaceAll("ç", "c");
};