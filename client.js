const { Client, GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');
const fs = require("fs");

const client = new Client({
  intents:
    [
      GatewayIntentBits.AutoModerationConfiguration,
      GatewayIntentBits.AutoModerationExecution,
      //GatewayIntentBits.DirectMessageReactions,
      //GatewayIntentBits.DirectMessageTyping,
      //GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent
    ],
  failIfNotExists: false,
  //restRequestTimeout: 60000
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
global.client = client;

//------------------------------Ayarlar------------------------------//
client.settings = {
  presences: [
    "📌 Nraphy Altyapısı"
  ],
  prefix: "n!",
  owner: "700385307077509180",
  icon: "https://cdn.discordapp.com/attachments/801418986809589771/975048501912272997/Narpitti.png",
  embedColors: {
    default: 0xEB1C5A, //"eb1c5a" (Nraphy), "00ffb8" (Test),
    green: 0x2ECC71,
    red: 0xE74C3C,
    yellow: 0xFEE75C,
    blue: 0x3498DB,
    darkGrey: 0x979C9F
  },
  invite: "https://discord.com/oauth2/authorize?client_id=700959962452459550&permissions=8&redirect_uri=https://discord.gg/VppTU9h&scope=applications.commands%20bot&response_type=code"
};

//------------------------------Client Tanımları------------------------------//
client.commands = new Discord.Collection();
client.database = require('./Mongoose/Mongoose.js');
client.logger = require("./modules/Logger.js");
client.date = require("./modules/Date.js");
client.functions = require("./modules/Functions.js");
client.config = require("./config.json");
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

//Veri tabanı önbellekleme
global.localDatabase = { guilds: {} };
client.guildsWaitingForSync = [];

//Gereksiz hafıza (Oturum bitiminde kaybolacaklar)
client.userDataCache = {};
client.guildDataCache = {};

//kaldırılacak bunlar
client.guildInvites = new Map();
client.gamesPlaying = new Map();
client.usersMap = new Map();
client.warnsMap = new Map();

//------------------------------Event Loader------------------------------//
const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
//client.logger.load(`Loading Events...`)
for (let eventFile of eventFiles) {
  let event = require(`./events/${eventFile}`);
  let eventName = eventFile.split(".")[0];
  //client.logger.event(`Loading Event: ${eventName}`);
  client.on(eventName, event.bind(null, client));
}
//client.logger.event(`Events Loaded!`)

//------------------------------Command Loader------------------------------//
const commandCategories = fs.readdirSync('./commands/');
//client.logger.load(`Loading Commands...`)
commandCategories.forEach(commandCategory => {
  fs.readdir(`./commands/${commandCategory}/`, (err, commandCategoryFiles) => {
    if (err) console.error(err);
    //console.log(`${files.length} command will be loaded.`);
    /*for (let commandFile of commandCategoryFiles) {
      let command = require(`./commands/${commandCategory}/${commandFile}`);
      console.log(`Loaded command: ${command.name}`);
      client.commands.set(command.interaction ? command.interaction.name : command.name, command);
      if (command.interaction)
        interactionCommands.push(command.interaction);
    };*/
    commandCategoryFiles.forEach(commandFile => {
      let command = require(`./commands/${commandCategory}/${commandFile}`);
      //console.log(`Loaded command: ${command.name}`);
      if (!command.disabled)
        client.commands.set(command.interaction ? command.interaction.name : command.name, command);
      /*if (command.interaction)
        interactionCommands.push(command.interaction);*/
    });
  });
});

//'./events/ready.js' dizininde devam ediyor.

//------------------------------Mongoose------------------------------//
const mongoose = require('mongoose');
client.database = require('./Mongoose/Mongoose.js');
mongoose.set("strictQuery", false);
mongoose.connect(client.config.mongooseToken, {
  maxPoolSize: 25,
  /*useNewUrlParser: true,
  useUnifiedTopology: true*/
}).then(() => {
  //client.logger.log('Connected to MongoDB');
}).catch((err) => {
  console.log('Unable to connect to MongoDB Database.\nError: ' + err);
});

//------------------------------Client------------------------------//
client.on("disconnect", () => client.logger.error("Bot is disconnecting..."));
client.on("reconnecting", () => client.logger.error("Bot reconnecting..."));
client.on("error", (e) => client.logger.error(e));
client.on("warn", (info) => { console.log("client.on(\"warn\") event"); client.logger.error(info); });
//client.on("debug", (log) => client.logger.debug(log, "debug", false));
//client.on("raw", r => client.logger.debug(r.t, "debug", false));
client.on('shardError', error => {
  console.error('A websocket connection encountered an error:', error);
  client.logger.error(error);
});

client.rest.on("rateLimited", (log) => client.logger.debug(log));

process.on("unhandledRejection", (err) => { /*console.error(err);*/ client.logger.error(err); });
process.on('uncaughtException', (err) => { /*console.error(err);*/ client.logger.error(err); });
//process.setMaxListeners(0);

client.login(client.config.isTest ? client.config.testConfig.token : client.config.token);

//------------------------------Discord-Player------------------------------//
const { Player } = require('discord-player');
const { useQueue } = require("discord-player");

const { BridgeProvider, BridgeSource } = require('@discord-player/extractor');

const bridgeProvider = new BridgeProvider(BridgeSource.SoundCloud);

client.player = new Player(client, {
  bridgeProvider
});
client.player.useQueue = useQueue;

//client.player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor').then(() => { });
client.player.extractors.loadDefault().then(() => { });

const discordPlayerEventFiles = fs.readdirSync('./events/discord-player/').filter(file => file.endsWith('.js'));
//client.logger.load(`Loading Events...`)
for (let file of discordPlayerEventFiles) {
  let event = require(`./events/discord-player/${file}`);
  let eventName = file.split(".")[0];
  //client.logger.event(`Loading Event: ${eventName}`);
  client.player.events.on(eventName, event.bind(null, client));
}

//------------------------------Log Sistemi------------------------------//
const logEventFiles = fs.readdirSync('./events/logger/').filter(file => file.endsWith('.js'));
//client.logger.load(`Loading Events...`)
for (let file of logEventFiles) {
  let event = require(`./events/logger/${file}`);
  let eventName = file.split(".")[0];
  //client.logger.event(`Loading Event: ${eventName}`);
  client.on(eventName, event.bind(null, client));
}

//------------------------------Davet Sistemi------------------------------//
client.on('inviteCreate', async invite => {

  const guildData = await client.database.fetchGuild(invite.guild.id);

  if (guildData.inviteManager?.channel && invite.guild.members.cache.get(client.user.id).permissions.has("ManageGuild")) {

    const invites = await invite.guild.invites.fetch();
    const codeUses = new Map();

    invites.each(inv => codeUses.set(inv.code, inv.uses));
    client.guildInvites.set(invite.guild.id, codeUses);

  }
});

//------------------------------toEN------------------------------//
String.prototype.toEN = function () {
  return this//UPPERS:     // LOWERS:
    .replaceAll("Ğ", "G").replaceAll("ğ", "g")
    .replaceAll("Ü", "U").replaceAll("ü", "u")
    .replaceAll("Ş", "S").replaceAll("ş", "s")
    .replaceAll("İ", "I").replaceAll("ı", "i")
    .replaceAll("Ö", "O").replaceAll("ö", "o")
    .replaceAll("Ç", "C").replaceAll("ç", "c");
};

//------------------------------GitHub------------------------------//
setInterval(() => {
  client.logger.warn("Nraphy GitHub projesinde onbinlerce satırlık emek bulunmaktadır.");
  client.logger.warn("GitHub üzerinden projemizi yıldızlayarak projeye destek olabilirsiniz.");
  client.logger.warn("https://github.com/RFKaya/Nraphy/");
}, 3600000);