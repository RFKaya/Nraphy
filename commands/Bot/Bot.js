const { ButtonBuilder } = require('discord.js');
const humanize = require("humanize-duration");
const os = require('os');
const axios = require('axios');
const { getLastDays } = require("../../modules/Functions");

module.exports = {
  interaction: {
    name: "bot",
    description: "Bot hakkında bilgiler gösterir.",
    options: [],
  },
  interactionOnly: true,
  aliases: ["botstat", "botb", "bot-bilgi", "botbilgi", "i", 'info'],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: 30000,
  ownerOnly: false,
  voteRequired: true,

  async execute(client, interaction, data) {

    return interaction.reply({ content: "Bu komut Nraphy client'ına özeldir. Kendi client'ınız üzerinde kullanmak için düzenleme yapmanız gerekir." });

    await interaction.deferReply();

    var usageStatsPageEmbed = null;
    var lastDays = await getLastDays(14); //14

    try {

      //------------------------------Butonlar------------------------------//

      let destekSunucusuButon = new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link');
      let davetBağlantısıButon = new ButtonBuilder().setLabel('Davet Bağlantısı').setURL(client.settings.invite).setStyle('Link');
      let sponsorButon = new ButtonBuilder().setLabel('Sponsor (gibir.net.tr)').setURL("https://gibir.net.tr/?utm_source=Nraphy&utm_medium=buttons&utm_id=Nraphy").setStyle('Link');

      let mainPageButton = new ButtonBuilder().setLabel('Ana Sayfa').setCustomId("mainPageButton").setStyle('Primary');
      let usageStatsPageButton = new ButtonBuilder().setLabel('Kullanım/Sistem İstatistikleri').setCustomId("usageStatsPageButton").setStyle('Primary');
      let healthCheckPageButton = new ButtonBuilder().setLabel('Durum Kontrol').setCustomId("healthCheckPageButton").setStyle('Primary');//.setDisabled(true);

      if (interaction.user.id !== client.settings.owner) usageStatsPageButton.setStyle('Danger');
      if (interaction.user.id !== client.settings.owner) healthCheckPageButton.setStyle('Danger');

      //------------------------------Butonlar------------------------------//

      //------------------------------Ana Sayfa------------------------------//

      //---------------Botun Sahibi---------------//
      let sahip = (await client.shard.broadcastEval((c, ownerId) => c.users.cache.get(ownerId), { context: client.settings.owner })).find(res => res);

      //---------------Bot Anlık İstatistikleri---------------//
      let results = await Promise.all([
        await client.shard.fetchClientValues('guilds.cache.size'),
        await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        await client.shard.broadcastEval(c => c.voice.adapters.size),
        await client.shard.broadcastEval(c => c.distube?.queues.size || 0)
      ]);
      let totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      let totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
      let voiceChannels = results[2].reduce((acc, voiceChannelCount) => acc + voiceChannelCount, 0);
      let playerQueues = results[3].reduce((acc, playerQueuesSize) => acc + playerQueuesSize, 0);

      //Düne göre sunucu farkını almaya yarayan kodlar
      let yesterdayData = await client.database.fetchClientData((await getLastDays(2)).pop());
      let yesterdayGuildCountDifference = totalGuilds - yesterdayData.guildCount;

      //---------------Hatalar---------------//
      let errorCount = (await client.database.fetchClientData()).error;
      let lastnDaysTotalErrors = 0;
      for await (let day of lastDays) {
        let clientDatabyDate = await client.database.fetchClientData(day);
        lastnDaysTotalErrors += clientDatabyDate.error;
      }
      let ortalamaError = (lastnDaysTotalErrors / 14).toFixed();
      let ortalamaErrorFark = errorCount - ortalamaError;

      //---------------Komutlar Hakkında---------------//
      let clientCommands = client.commands.filter(command => command.category && command.category !== "Developer");
      let commandsInteractionSupport = 0;
      let commandsInteractionOnly = 0;
      let commandsVoteRequired = 0;
      clientCommands.forEach(command => {
        if (command.interaction) commandsInteractionSupport++;
        if (command.interactionOnly) commandsInteractionOnly++;
        if (command.voteRequired) commandsVoteRequired++;
      });

      //Ana Sayfa - Embed
      let mainPageEmbed = {
        color: client.settings.embedColors.default,
        author: {
          name: `${client.user.username} • Bot Bilgileri`,
          icon_url: client.settings.icon,
        },
        title: `**»** Tüm komutlara ulaşmak için \`${data.prefix}komutlar\` yazabilirsiniz!`,
        fields: [
          {
            name: '**»** Botun Sahibi',
            value: `**•** **\`${sahip.tag}\`** \`(ID: ${client.settings.owner})\``,
          },
          {
            name: '**»** Bot Anlık İstatistikleri',
            value:
              `**•** Sunucular: \`${totalGuilds} (Düne göre ${(yesterdayGuildCountDifference < 0 ? "" : "+") + yesterdayGuildCountDifference})\`\n` +
              `**•** Kullanıcılar: \`${totalMembers}\``,
          },
          {
            name: '**»** Sistem İstatistikleri',
            value:
              `**•** Uptime: \`${humanize(os.uptime() * 1000, { language: "tr", round: true, largest: 2 })}\`\n` +
              //`**•** Kullanılabilir Bellek: \`${((os.freemem() * (10 ** -6)) / 1024).toFixed(2)} GB\`\n` +
              `**•** Bellek Kullanımı: \`${((os.totalmem() - os.freemem()) / (1024 ** 3)).toFixed(2)} GB/${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB (%${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed()})\``
          },
          {
            name: '**»** Hatalar (Günlük)',
            value:
              `**•** Tespit Edilen Hatalar: \`${errorCount} (${ortalamaErrorFark == 0 ?
                "Ortalamaya denk"
                : ortalamaErrorFark > 0 ?
                  `Ortalamadan ${ortalamaErrorFark} fazla ⚠️`
                  : `Ortalamadan ${Math.abs(ortalamaErrorFark)} az ✅`
              })\``
            //`**•** Shard Çökmeleri: \`${clientData.crash}\``
          },
          {
            name: '**»** Müzik Sistemi (Anlık)',
            value:
              `**•** Bulunduğu Sesli Kanallar: \`${voiceChannels}\`\n` +
              `**•** Aktif Müzik Kuyrukları: \`${playerQueues}\``
          },
          {
            name: `**»** Komutlar Hakkında`,
            value:
              `**•** Komut Sayısı: \`${clientCommands.size}\`\n` +
              `**•** Slash Destekleme Oranı: \`%${(commandsInteractionSupport / clientCommands.size * 100).toFixed()}\`\n` +
              `**•** Klasik Giriş Destekleme Oranı: \`%${((clientCommands.size - commandsInteractionOnly) / clientCommands.size * 100).toFixed()}\`\n` +
              `**•** Her İkisini Destekleme Oranı: \`%${((commandsInteractionSupport - commandsInteractionOnly) / clientCommands.size * 100).toFixed()}\`\n\n` +

              `**•** __Oy (Vote) Zorunlu Komutlar__ \`(%${(commandsVoteRequired / clientCommands.size * 100).toFixed()})\`\n` +
              `**•** \`${clientCommands
                .filter(command => command.voteRequired)
                .map(command => (command.interaction || command).name)
                .map(command => command.replace(/-/g, " ").toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
                  return letter.toUpperCase();
                }))
                .join(', ')
              }\``
          },
          /*{
            name: '**»** Oturum Süresi',
            value: `**•** \`${humanize(Date.now() - clientData.registeredAt, { language: "tr", round: true, largest: 2 })}\``,
          },*/
          {
            name: '**»** Ping & Uptime',
            value: `**•** \`/shard\``,
          },
        ],
      };

      //------------------------------Ana Sayfa------------------------------//

      interaction.editReply({
        embeds: [mainPageEmbed],
        components: [
          {
            data: { type: 1 },
            components: [
              destekSunucusuButon,
              davetBağlantısıButon,
              sponsorButon
            ]
          },
          {
            data: { type: 1 },
            components: [
              mainPageButton.setDisabled(true),
              usageStatsPageButton.setDisabled(false),
              healthCheckPageButton.setDisabled(false)
            ]
          },
        ]
      });

      const reply = await interaction.fetchReply();
      const filter = i => {
        return i.message.id === reply.id && i.deferUpdate() && i.user.id === interaction.user.id;
      };

      const collector = reply.createMessageComponentCollector({ filter, time: 900000 });

      collector.on('collect', async btn => {

        switch (btn.customId) {
          case "mainPageButton":
            interaction.editReply({
              embeds: [mainPageEmbed],
              components: [
                {
                  data: { type: 1 },
                  components: [destekSunucusuButon, davetBağlantısıButon, sponsorButon]
                },
                {
                  data: { type: 1 },
                  components: [
                    mainPageButton.setDisabled(true),
                    usageStatsPageButton.setDisabled(false),
                    healthCheckPageButton.setDisabled(false)
                  ]
                },
              ]
            });
            break;

          //------------------------------Kullanım/Sistem İstatistikleri------------------------------//
          case "usageStatsPageButton":

            //---------------Owner Only---------------//
            if (interaction.user.id !== client.settings.owner)
              return interaction.editReply({
                embeds: [
                  {
                    color: client.settings.embedColors.red,
                    description: "🔒 Burası Rauqq abime özeldir!"
                  }
                ],
                components: [
                  {
                    data: { type: 1 },
                    components: [destekSunucusuButon, davetBağlantısıButon, sponsorButon]
                  },
                  {
                    data: { type: 1 },
                    components: [
                      mainPageButton.setDisabled(false),
                      usageStatsPageButton.setDisabled(true),
                      healthCheckPageButton.setDisabled(false)
                    ]
                  },
                ]
              });

            if (usageStatsPageEmbed) return interaction.editReply({
              embeds: [usageStatsPageEmbed],
              components: [
                {
                  data: { type: 1 },
                  components: [destekSunucusuButon, davetBağlantısıButon, sponsorButon]
                },
                {
                  data: { type: 1 },
                  components: [
                    mainPageButton.setDisabled(false),
                    usageStatsPageButton.setDisabled(true),
                    healthCheckPageButton.setDisabled(false)
                  ]
                },
              ]
            }); else {
              await interaction.editReply({
                embeds: [{
                  color: client.settings.embedColors.default,
                  author: {
                    name: `${client.user.username} • Bot Bilgileri`,
                    icon_url: client.settings.icon,
                  },
                  title: `**»** Kullanım/Sistem İstatistikleri!`,
                  description: `**•** Sayfa oluşturulurken lütfen bekleyin...`,
                }],
                components: [
                  {
                    data: { type: 1 },
                    components: [destekSunucusuButon, davetBağlantısıButon, sponsorButon]
                  },
                  {
                    data: { type: 1 },
                    components: [
                      mainPageButton.setDisabled(true),
                      usageStatsPageButton.setDisabled(true),
                      healthCheckPageButton.setDisabled(true)
                    ]
                  },
                ]
              });
            };

            //---------------Sistemlerin Kullanım İstatistikleri---------------//
            let userDatas = await client.database.users.find().lean().exec(),
              guildDatas = await client.database.guilds.find().lean().exec();

            let linkBlock_guilds = 0,
              buttonRole_messages = 0,
              inviteManager_guilds = 0,
              gallery_channels = 0,
              tempChannels_guilds = 0,
              logger_guilds = 0,
              campaignNews_guilds = 0,
              autoReply_guilds = 0,
              autoRole_guilds = 0,
              memberCounter_guilds = 0,
              spamProtection_guilds = 0,
              upperCaseBlock_guilds = 0,
              warns_users = 0,
              warns_warns = 0,
              wordGame_guilds = 0,
              countingGame_guilds = 0,
              nameClearing_guilds = 0,
              boostedGuilds = 0,
              mentionSpamBlock_guilds = 0;

            for await (let guildData of guildDatas) {

              //Bağlantı-Engel
              if (guildData.linkBlock?.guild) linkBlock_guilds++;

              //Buton-Rol
              if (guildData.buttonRole && Object.keys(guildData.buttonRole)?.length)
                for await (let message of Object.keys(guildData.buttonRole)) {
                  buttonRole_messages++;
                }

              //Büyük Harf Engelleme
              if (guildData.upperCaseBlock?.guild) upperCaseBlock_guilds++;

              //Davet-Sistemi
              if (guildData.inviteManager?.channel && guildData.inviteManager.channel !== "false") inviteManager_guilds++;

              //Etiket Sınırlama
              if (guildData.mentionSpamBlock?.autoModerationRuleId) mentionSpamBlock_guilds++;

              //Nraphy ile Güçlendirilmiş Sunucular
              if (guildData.NraphyBoost?.users?.length) boostedGuilds++;

              //İsim-Temizleme
              if (guildData.nameClearing) nameClearing_guilds++;

              //Sayaç
              if (guildData.memberCounter?.channel) memberCounter_guilds++;

              //Oto-Cevap
              if (guildData.autoReply) autoReply_guilds++;

              //Kampanya-Haber
              if (guildData.campaignNews) campaignNews_guilds++;

              //Gallery
              if (guildData.gallery) gallery_channels++;

              //Geçici Odalar
              if (guildData.tempChannels) tempChannels_guilds++;

              //Log
              if (guildData.logger?.webhook) logger_guilds++;

              //Oto-Rol
              if (guildData.autoRole?.channel) autoRole_guilds++;

              //Spam Koruması
              if (guildData.spamProtection?.guild) spamProtection_guilds++;

              //Uyarılar
              if (guildData.warns && Object.keys(guildData.warns)?.length)
                for await (let warnDataId of Object.keys(guildData.warns)) {
                  warns_users++;

                  let warnData = guildData.warns[warnDataId];
                  if (warnData.length) warns_warns += warnData.length;
                }

              //Kelime-Oyunu
              if (guildData.wordGame?.channel) wordGame_guilds++;

              //Sayı-Saymaca
              if (guildData.countingGame?.channel) countingGame_guilds++;

            }

            await client.wait(1000);

            //Çekilişler
            var availableBetaGiveaways = await client.database.betaGiveaways.find().lean().exec()
              .then(g => g.filter(giveaway => !giveaway.isEnded));

            //---------------Kullanılan Komutlar---------------//
            let commandUses = {};

            for await (let day of lastDays) {
              let clientDatabyDate = await client.database.fetchClientData(day);

              for (var command in clientDatabyDate.commandUses) {

                //sortable.push({ command: command, uses: clientDatabyDate.commandUses[command] });
                commandUses[command] ?
                  commandUses[command] += clientDatabyDate.commandUses[command] :
                  commandUses[command] = clientDatabyDate.commandUses[command];
              }
            }

            let sortable = [];
            for (var command in commandUses) {
              sortable.push([command, commandUses[command]]);
            }

            sortable = sortable.sort(function (a, b) {
              return b[1] - a[1];
            }).slice(0, 20);

            let commandUsesList = await sortable.map(([commandName, uses]) => {
              return `**#${sortable.indexOf(sortable.find(qurve => qurve[0] == commandName)) + 1}** - **${client.capitalizeFirstLetter(commandName, "tr")}** • \`${new Intl.NumberFormat().format(uses >= 10 ? Math.floor(uses / 10) * 10 : uses)}+ Kullanım\``;
            });

            //---------------Diğer Bilgiler---------------//
            let yeniliklerinOkunması = 0,
              premiumUsers = 0;
            for await (let userData of userDatas) {
              if (userData.readDateOfChanges > client.settings.updateDate) yeniliklerinOkunması++;
              if (userData.NraphyPremium && (userData.NraphyPremium > Date.now())) premiumUsers++;
            }

            usageStatsPageEmbed = {
              color: client.settings.embedColors.default,
              author: {
                name: `${client.user.username} • Bot Bilgileri`,
                icon_url: client.settings.icon,
              },
              title: `**»** Kullanım/Sistem İstatistikleri!`,
              fields: [
                {
                  name: '**»** Kullanılan Komutlar (14 günlük)',
                  value:
                    commandUsesList/*.slice(0, 17)*/.join('\n').substring(0, 950),
                  //`Toplam Kullanım: \`${clientData.cmd + clientData.interactionCmd} (${clientData.interactionCmd} Interaction)\`\n` +,
                  inline: true
                },
                {
                  name: '**»** Sistemlerin Kullanım İstatistikleri (Anlık)',
                  value:
                    `**•** Bağlantı Engel: \`${linkBlock_guilds} Sunucu\`\n` +
                    `**•** Buton Rol: \`${buttonRole_messages} Mesaj\`\n` +
                    `**•** Büyük Harf Engel: \`${upperCaseBlock_guilds} Sunucu\`\n` +
                    `**•** Çekilişler: \`${availableBetaGiveaways.length} (Devam Eden)\`\n` +
                    `**•** Davet Sistemi: \`${inviteManager_guilds} Sunucu\`\n` +
                    `**•** Etiket Sınırlama: \`${mentionSpamBlock_guilds} Sunucu\`\n` +
                    `**•** Galeri: \`${gallery_channels} Kanal\`\n` +
                    `**•** Geçici Odalar: \`${tempChannels_guilds} Sunucu\`\n` +
                    `**•** İsim Temizleme: \`${nameClearing_guilds} Sunucu\`\n` +
                    `**•** Kampanya Haber: \`${campaignNews_guilds} Sunucu\`\n` +
                    `**•** Log: \`${logger_guilds} Sunucu\`\n` +
                    `**•** Oto-Cevap: \`${autoReply_guilds} Sunucu\`\n` +
                    `**•** Oto-Rol: \`${autoRole_guilds} Sunucu\`\n` +
                    `**•** Sayaç: \`${memberCounter_guilds} Sunucu\`\n` +
                    `**•** Spam Koruması: \`${spamProtection_guilds} Sunucu\`\n` +
                    `**•** Uyarılar: \`${warns_users} Kullanıcı, ${warns_warns} Uyarı\`\n` +
                    `**•** Kelime Oyunu: \`${wordGame_guilds} Sunucu\`\n` +
                    `**•** Sayı Saymaca: \`${countingGame_guilds} Sunucu\``,
                  inline: true
                },
                {
                  name: '**»** Diğer Bilgiler',
                  value:
                    `**•** Güncelleme Yayınlanma Tarihi: <t:${(client.settings.updateDate / 1000).toFixed(0)}:f> - \`(${humanize(Date.now() - client.settings.updateDate, { language: "tr", round: true, largest: 1 })} önce)\`\n` +
                    `**•** Yenilikleri Okuyan Kullanıcılar: \`${yeniliklerinOkunması}\`\n` +
                    `**•** Nraphy Premium Kullanıcıları: \`${premiumUsers}\`\n` +
                    `**•** Nraphy ile Güçlendirilmiş Sunucular: \`${boostedGuilds}\``,
                },
              ],
            };

            interaction.editReply({
              embeds: [usageStatsPageEmbed],
              components: [
                {
                  data: { type: 1 },
                  components: [destekSunucusuButon, davetBağlantısıButon, sponsorButon]
                },
                {
                  data: { type: 1 },
                  components: [
                    mainPageButton.setDisabled(false),
                    usageStatsPageButton.setDisabled(true),
                    healthCheckPageButton.setDisabled(false)
                  ]
                },
              ]
            });

            break;

          //------------------------------Kullanım/Sistem İstatistikleri------------------------------//
          case "healthCheckPageButton":

            //---------------Owner Only---------------//
            if (interaction.user.id !== client.settings.owner)
              return interaction.editReply({
                embeds: [
                  {
                    color: client.settings.embedColors.red,
                    description: "🔒 Burası Rauqq abime özeldir!"
                  }
                ],
                components: [
                  {
                    data: { type: 1 },
                    components: [destekSunucusuButon, davetBağlantısıButon, sponsorButon]
                  },
                  {
                    data: { type: 1 },
                    components: [
                      mainPageButton.setDisabled(false),
                      usageStatsPageButton.setDisabled(false),
                      healthCheckPageButton.setDisabled(true)
                    ]
                  },
                ]
              });

            (async () => {

              //TDK - Health Check
              let api_TDK = false;
              await axios.get(`https://sozluk.gov.tr/gts?ara=Merhaba`)
                .then(result => {
                  if (!result || !result.data || result.data.error) api_TDK = false; else api_TDK = true;
                }).catch(error => { api_TDK = false; });

              //The Cat API - Health Check
              let api_TCA = false;
              await axios.get(`https://api.thecatapi.com/v1/images/search`)
                .then(result => {
                  if (!result || !result.data || !result.data[0]?.url) api_TCA = false; else api_TCA = true;
                }).catch(error => { api_TCA = false; });

              //Durum Kontrol - Embed
              let healthCheckPageEmbed = {
                color: client.settings.embedColors.default,
                author: {
                  name: `${client.user.username} • Bot Bilgileri`,
                  icon_url: client.settings.icon,
                },
                title: `**»** Durum Kontrol!`,
                fields: [
                  {
                    name: '**»** API Durumları',
                    value:
                      `**•** TDK: ${api_TDK ? "✅" : "❌"}\n` +
                      `**•** The Cat API: ${api_TCA ? "✅" : "❌"}\n` +
                      `**•** UBilişim: `
                  },
                  {
                    name: '**»** NekoBot API',
                    value:
                      `**•** 144p: \n` +
                      `**•** Captcha: \n` +
                      `**•** Magik: \n` +
                      `**•** Trump: \n` +
                      `**•** Tweet: \n` +
                      `**•** NSFW:`,
                  },
                  {
                    name: '**»** Veri Tabanı Durumları',
                    value:
                      `**•** MongoDB Atlas: \n` +
                      `**•** Log (Yerel): `
                  },
                  {
                    name: '**»** Modüller',
                    value:
                      `**•** songlyrics: \n` +
                      `**•** tcmb-doviz: `
                  },
                ],
              };

              interaction.editReply({
                embeds: [healthCheckPageEmbed],
                components: [
                  {
                    data: { type: 1 },
                    components: [destekSunucusuButon, davetBağlantısıButon, sponsorButon]
                  },
                  {
                    data: { type: 1 },
                    components: [
                      mainPageButton.setDisabled(false),
                      usageStatsPageButton.setDisabled(false),
                      healthCheckPageButton.setDisabled(true)
                    ]
                  },
                ]
              });

            })();

            break;

          default:
            client.logger.error("bot komutunda eror ckt");
        }

      });

    } catch (err) {

      client.logger.error(err);

      await interaction.editReply({
        content: "Elimde olmayan sebeplerden dolayı verileri alamadım :/",
        components: []
      });

    }

  }
};