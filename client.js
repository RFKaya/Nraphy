const { Client, GatewayIntentBits, WebhookClient } = require('discord.js');
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
    ]
});

const interactionCommands = [];

client.userDataCache = {};
client.guildDataCache = {};

const lastMessage = new Set();

//------------------------------Ayarlar------------------------------//

client.settings = {
  presence: "PRESENCE",
  prefix: "YOUR PREFIX",
  owner: "OWNER ID",
  icon: "ICON LINK",
  embedColors: {
    default: 0xEB1C5A, //"eb1c5a" (Nraphy), "00ffb8" (Test),
    green: 0x2ECC71,
    red: 0xE74C3C,
    yellow: 0xFEE75C,
    blue: 0x3498DB,
  },
  language: "tr",
  invite: "INVITE URL",
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
client.userFetcher = require("./modules/userFetcher.js");
client.config = require("./config.json");
client.listGuilds = async function listGuilds() {
  var guilds = [];
  await client.shard.broadcastEval(c => c.guilds.cache).then(async function (guildsArray) {
    await guildsArray.forEach(async function (guildsInArray) {
      await guildsInArray.forEach(async function (guild) {
        await guilds.push(guild.id);
      });
    });
  });
  return guilds;
};
client.capitalizeFirstLetter = ([first, ...rest], locale = navigator.language) => first.toLocaleUpperCase(locale) + rest.join('');
client.wait = ms => new Promise(res => setTimeout(res, ms));

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

//process.setMaxListeners(0);

//require('events').EventEmitter.prototype._maxListeners = 100;

//------------------------------Kurulum------------------------------//

//------------------------------Log Sistemi------------------------------//

//Starting all events
const eventFiles = fs.readdirSync('./events/logger/').filter(file => file.endsWith('.js'));
//client.logger.load(`Loading Events...`)
for (const file of eventFiles) {
  const event = require(`./events/logger/${file}`);
  const eventName = file.split(".")[0];
  //client.logger.event(`Loading Event: ${eventName}`);
  client.on(eventName, event.bind(null, client));
}

//------------------------------Log Sistemi------------------------------//

//------------------------------Presence Yenileme------------------------------//

const { slash } = require('./modules/Logger.js');

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

//------------------------------Prefixim------------------------------//

client.on("messageCreate", async message => {

  if (!message.guild || message.author.bot) return;

  if (lastMessage.has(message.author.id)) return;
  lastMessage.add(message.author.id);
  setTimeout(() => { lastMessage.delete(message.author.id); }, 1200);

  let guildData = await client.database.fetchGuild(message.guild.id);
  let prefix = guildData.prefix || client.settings.prefix;

  try {

    //Prefixim
    if (message.content.toLowerCase() === `<@!${client.user.id}>` || message.content.toLowerCase() === `<@${client.user.id}>`) {

      message.channel.send({
        embeds: [{
          color: client.settings.embedColors.default,
          description: `**»** Prefixim \`${prefix}\` • \`${prefix}komutlar\` yazarak tüm komutlara ulaşabilirsin.`
        }]
      });
    } else if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {

      //Komutları şimdilik açık kaynak olarak yayınlamadığım için bu kısım çalışmaz.
      return;

      const cmd = client.commands.get("soru-sor");

      const data = {};
      data.prefix = prefix;
      const args = message.content.slice(message.content.startsWith(`<@!${client.user.id}>`) ? `<@!${client.user.id}>`.length : `<@${client.user.id}>`.length).trim().split(/ +/g);

      cmd.execute(client, message, data, args);

    }

  } catch (err) { client.logger.error(err); };

});

//------------------------------Prefixim------------------------------//   