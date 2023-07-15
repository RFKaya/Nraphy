const { Client, GatewayIntentBits, Options } = require('discord.js');
const Discord = require('discord.js');
const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);

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
  //failIfNotExists: false,
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

const interactionCommands = [];

//Veri Tabanı yerel hafıza
global.localDatabase = { guilds: {}, users: {} };
client.guildsWaitingForSync = [];

//Gereksiz database
client.userDataCache = {};
client.guildDataCache = {};
client.clientDataCache = { topggStatus: { status: true, lastCheck: null }, logQueue: [] };

//kaldırılacak bunlar
client.guildInvites = new Map();
client.gamesPlaying = new Map();
client.usersMap = new Map();
client.warnsMap = new Map();

//------------------------------Ayarlar------------------------------//

client.settings = {
  presences: [
    "📌 /komutlar"
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

//------------------------------Ayarlar------------------------------//

//------------------------------Kurulum------------------------------//

client.events = new Discord.Collection();
client.commands = new Discord.Collection();
client.database = require('./Mongoose/Mongoose.js');
client.logger = require("./modules/Logger.js");
client.date = require("./modules/Date.js");
client.functions = require("./modules/Functions.js");
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

  //---------------Mongoose Database---------------//
  const mongoose = require('mongoose');
  client.database = require('./Mongoose/Mongoose.js');
  client.databaseQueue = { users: {}, guilds: {}, client: {} };
  mongoose.set("strictQuery", false);
  await mongoose.connect(client.config.mongooseToken, {
    maxPoolSize: 25,
    /*useNewUrlParser: true,
    useUnifiedTopology: true*/
  }).then(() => {
    client.logger.log('Connected to MongoDB');
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
client.on("warn", (info) => { console.log("client.on(\"warn\") event"); client.logger.error(info); });
//client.on("debug", (log) => client.logger.debug(log))
//client.on("raw", r => client.logger.debug(r.t))

client.on('shardError', error => {
  console.error('A websocket connection encountered an error:', error);
  client.logger.error(error);
});

process.on("unhandledRejection", (err) => {
  //console.error(err);
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

const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

client.distube = new DisTube(client, {
  leaveOnStop: true,
  leaveOnEmpty: true,
  emptyCooldown: 10,
  leaveOnFinish: true,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ]
});

client.distube
  .on('playSong', (queue, song) => {
    let embed = {
      color: client.settings.embedColors.green,
      title: `**»** **${queue.voiceChannel.name}** odasında şimdi oynatılıyor;`,
      description: `**•** [${song.name}](${song.url})`, //(${song.formattedDuration})
      thumbnail: {
        url: song.thumbnail,
      },
    };

    if (song.metadata.commandMessage.type === 2 && !song.metadata.commandMessage.replied)
      song.metadata.commandMessage.editReply({ embeds: [embed] });
    else queue.textChannel.send({ embeds: [embed] });
    //` | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`);
  })
  .on('addSong', (queue, song) => {
    let embed = {
      color: client.settings.embedColors.green,
      title: `**»** Sıraya Bir Şarkı Eklendi!`,
      description: `**•** [${song.name}](${song.url})`,
      thumbnail: {
        url: song.thumbnail,
      },
    };
    if (song.metadata.commandMessage.type === 2)
      song.metadata.commandMessage.editReply({ embeds: [embed] });
    else queue.textChannel.send({ embeds: [embed] });
  })
  .on('addList', (queue, playlist) => {
    let embed = {
      color: client.settings.embedColors.green,
      title: `**»** Sıraya Bir Oynatma Listesi Eklendi!`,
      description:
        `**•** [${playlist.name}](${playlist.url})\n` +
        `**•** Sıraya **${playlist.songs.length}** şarkı eklendi.`,
      thumbnail: {
        url: playlist.thumbnail,
      },
    };
    if (playlist.metadata.commandMessage.type === 2)
      playlist.metadata.commandMessage.editReply({ embeds: [embed] });
    else queue.textChannel.send({ embeds: [embed] });
  })
  .on('error', (channel, error) => {

    require('./events/distube/functions/errorHandler.js')(client, error, channel);

  })
  .on('empty', queue => {
    queue.textChannel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: `**»** Oynatma Sonlandırıldı!`,
          description: `**•** Odada kimse kalmadığı için oynatma bitirildi.`,
        }
      ]
    }).catch(e => { });
  })
  .on('searchNoResult', (message, query) => {
    message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          description: `**»** Bir sonuç bulunamadı!`,
        }
      ]
    }).catch(e => { });
  })
  .on('finish', queue => {
    queue.textChannel.send({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: `**»** Oynatma Sonlandırıldı!`,
          description: `**•** Sırada şarkı kalmadığı için oynatma bitirildi!`,
        }
      ]
    }).catch(e => { });
  })
  .on("initQueue", queue => {
    queue.volume = 80;
  });

//------------------------------Müzik------------------------------//

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

//------------------------------Davet Sistemi Başlangıç------------------------------//

client.on('inviteCreate', async invite => {

  const guildData = await client.database.fetchGuild(invite.guild.id);

  if (guildData.inviteManager?.channel && invite.guild.members.cache.get(client.user.id).permissions.has("ManageGuild")) {

    const invites = await invite.guild.invites.fetch();
    const codeUses = new Map();

    invites.each(inv => codeUses.set(inv.code, inv.uses));
    client.guildInvites.set(invite.guild.id, codeUses);

  }
});

//------------------------------Davet Sistemi Bitiş------------------------------//

String.prototype.toEN = function () {
  return this//UPPERS:     // LOWERS:
    .replaceAll("Ğ", "G").replaceAll("ğ", "g")
    .replaceAll("Ü", "U").replaceAll("ü", "u")
    .replaceAll("Ş", "S").replaceAll("ş", "s")
    .replaceAll("İ", "I").replaceAll("ı", "i")
    .replaceAll("Ö", "O").replaceAll("ö", "o")
    .replaceAll("Ç", "C").replaceAll("ç", "c");
};
