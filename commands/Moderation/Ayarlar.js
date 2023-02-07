const db = require('quick.db');
const axios = require('axios');
const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "ayarlar",
    description: "Sunucunun Nraphy ayarlarını gösterir.",
    options: []
  },
  interactionOnly: true,
  aliases: ["settings"],
  //category: "Moderation",
  memberPermissions: ["ManageMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const autoReply = data.guild.autoReply;
    const autoRole = data.guild.autoRole;
    const campaignNews = data.guild.campaignNews;
    const countingGame = data.guild.countingGame; //db.fetch(`guilds.${interaction.guild.id}.countingGame`);
    const gallery = data.guild.gallery;
    const linkBlock = data.guild.linkBlock;
    const logger = data.guild.logger;
    if (logger && logger.webhook) {
      await axios
        .get(logger.webhook)
        .then(res => { logger.channel = res.data.channel_id; })
        .catch(error => { client.logger.error(error); });
    }
    const upperCaseBlock = data.guild.upperCaseBlock;
    const spamProtection = data.guild.spamProtection;
    const prefix = data.guild.prefix || client.settings.prefix;
    const wordGame = data.guild.wordGame; //db.fetch(`guilds.${interaction.guild.id}.wordGame`);

    const inviteManager = db.fetch(`guilds.${interaction.guild.id}.inviteManager`);
    const memberCounter = db.fetch(`guilds.${interaction.guild.id}.memberCounter`);
    const isimTemizleme = db.fetch(`isim-temizle.${interaction.guild.id}`);

    //Uyarılar
    let warns_users = 0, warns_warns = 0;
    if (Object.keys(data.guild.warns || {})?.length)
      for await (let warnDataId of Object.keys(data.guild.warns || {})) {
        warns_users++;

        let warnData = data.guild.warns[warnDataId];
        if (warnData.length) warns_warns += warnData.length;
      }


    const moderationPageEmbed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${interaction.guild.name} Sunucusunun Ayarları (Moderasyon)`,
        icon_url: interaction.guild.iconURL(),
      },
      title: `**»** Prefix: \`${prefix !== client.settings.prefix ? prefix : `${client.settings.prefix} (Varsayılan)`}\``,
      fields: [
        {
          name: '**»** Davet Sistemi',
          value: `**•** ${inviteManager ? `Kanal: ${interaction.guild.channels.cache.get(inviteManager.channel)}` : `\`Kapalı\``}`,
        },
        {
          name: '**»** Oto-Cevap',
          value: `**•** ${autoReply ? `\`Açık\`` : `\`Kapalı\``}`,
        },
        {
          name: '**»** Oto-Rol',
          value: `**•** ${autoRole.role ? `Rol: ${interaction.guild.roles.cache.get(autoRole.role)}\n**•** Kanal: ${autoRole.channel ? interaction.guild.channels.cache.get(autoRole.channel) : `\`Ayarlı Değil\``}` : `\`Kapalı\``}`,
        },
        {
          name: '**»** Sayaç',
          value: `**•** ${memberCounter ? `Kanal: ${interaction.guild.channels.cache.get(memberCounter.channel)}\n**•** Hedef: \`${memberCounter.target}\`` : `\`Kapalı\``}`,
        },
        {
          name: '**»** Kampanya Haber',
          value: `**•** ${campaignNews ? `Kanal: ${interaction.guild.channels.cache.get(campaignNews)}` : `\`Kapalı\``}`,
        },
        {
          name: '**»** Log Sistemi',
          value: `**•** ${logger && logger.webhook ? interaction.guild.channels.cache.get(logger.channel) : `\`Kapalı\``}`,
        },
        {
          name: '**»** Galeri Kanalı',
          value: `**•** ${gallery ? `${interaction.guild.channels.cache.get(gallery)}` : `\`Kapalı\``}`,
        },
        {
          name: '**»** Uyarılar',
          value: `**•** ${warns_warns ? `\`${warns_users} Kullanıcı, ${warns_warns} Uyarı\`` : `\`Bu sunucuda hiçbir kullanıcı uyarılmamış.\``}`,
        },
        {
          name: '**»** İsim Temizleme Sistemi',
          value: `**•** ${isimTemizleme ? `\`Açık\`` : `\`Kapalı\``}`,
        },
      ],
    };

    const linkBlockPageEmbed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${interaction.guild.name} Sunucusunun Ayarları (Bağlantı Engel)`,
        icon_url: interaction.guild.iconURL(),
      },
      title: `**»** ${linkBlock && (linkBlock.guild || (linkBlock.channels && linkBlock.channels.length > 0)) ? linkBlock.guild ? "Sunucu Genelinde Açık!" : "Belirli Kanallarda Açık!" : "Kapalı"}`,
      fields: [
        {
          name: '**»** Aktif Kanallar',
          value: `**•** ` +
            (linkBlock && (linkBlock.guild || (linkBlock.channels && linkBlock.channels.length > 0)) ?
              linkBlock.guild ?
                linkBlock.channels ?
                  "Muaf kanallar hariç tüm sunucu!"
                  : "Tüm sunucu!"
                : linkBlock.channels.map(channel => interaction.guild.channels.cache.get(channel)).join(`\n**•** `)
              : "Kapalı")
        },
        {
          name: '**»** Muaflar',
          value:
            `**•** Kanallar: ${(linkBlock && linkBlock.exempts && linkBlock.exempts.channels && linkBlock.exempts.channels.length > 0) ?
              linkBlock.exempts.channels.map(channel => interaction.guild.channels.cache.get(channel)).join(`, `)
              : `\`Muaf kanal yok\``}\n` +
            `**•** Roller: ${(linkBlock && linkBlock.exempts && linkBlock.exempts.roles && linkBlock.exempts.roles.length > 0) ?
              linkBlock.exempts.roles.map(role => interaction.guild.roles.cache.get(role)).join(`, `)
              : `\`Muaf rol yok\``}\n` +
            `**•** Bağlantılar: \`GIPHY, Tenor, GIBIRNet\` (Düzenleme şimdilik mevcut değil)\n` +
            `**•** Ek: \`"Mesajları Yönet" yetkisine sahip üyeler\``
        },
      ],
    };

    const upperCaseBlockPageEmbed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${interaction.guild.name} Sunucusunun Ayarları (Büyük Harf Engel)`,
        icon_url: interaction.guild.iconURL(),
      },
      title: `**»** ${upperCaseBlock && (upperCaseBlock.guild || (upperCaseBlock.channels && upperCaseBlock.channels.length > 0)) ? upperCaseBlock.guild ? "Sunucu Genelinde Açık!" : "Belirli Kanallarda Açık!" : "Kapalı"}`,
      fields: [
        {
          name: '**»** Aktif Kanallar',
          value: `**•** ` +
            (upperCaseBlock && (upperCaseBlock.guild || (upperCaseBlock.channels && upperCaseBlock.channels.length > 0)) ?
              upperCaseBlock.guild ?
                upperCaseBlock.channels ?
                  "Muaf kanallar hariç tüm sunucu!"
                  : "Tüm sunucu!"
                : upperCaseBlock.channels.map(channel => interaction.guild.channels.cache.get(channel)).join(`\n**•** `)
              : "Kapalı")
        },
        {
          name: '**»** Büyük Harf Oranı',
          value: `**•** ${upperCaseBlock.rate ? `\`%${upperCaseBlock.rate}\`` : `\`Varsayılan (%70)\``}`
        },
        {
          name: '**»** Muaflar',
          value:
            `**•** Kanallar: ${(upperCaseBlock && upperCaseBlock.exempts && upperCaseBlock.exempts.channels && upperCaseBlock.exempts.channels.length > 0) ?
              upperCaseBlock.exempts.channels.map(channel => interaction.guild.channels.cache.get(channel)).join(`, `)
              : `\`Muaf kanal yok\``}\n` +
            `**•** Roller: ${(upperCaseBlock && upperCaseBlock.exempts && upperCaseBlock.exempts.roles && upperCaseBlock.exempts.roles.length > 0) ?
              upperCaseBlock.exempts.roles.map(role => interaction.guild.roles.cache.get(role)).join(`, `)
              : `\`Muaf rol yok\``}\n` +
            `**•** Ek: \`"Mesajları Yönet" yetkisine sahip üyeler\``
        },
      ],
    };

    const spamProtectionPageEmbed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${interaction.guild.name} Sunucusunun Ayarları (Spam Koruması)`,
        icon_url: interaction.guild.iconURL(),
      },
      title: `**»** ${spamProtection && (spamProtection.guild || (linkBlock.channels && spamProtection.channels.length > 0)) ? spamProtection.guild ? "Sunucu Genelinde Açık!" : "Belirli Kanallarda Açık!" : "Kapalı"}`,
      fields: [
        {
          name: '**»** Aktif Kanallar',
          value: `**•** ` +
            (spamProtection && (spamProtection.guild || (spamProtection.channels && spamProtection.channels.length > 0)) ?
              spamProtection.guild ?
                spamProtection.channels ?
                  "Muaf kanallar hariç tüm sunucu!"
                  : "Tüm sunucu!"
                : spamProtection.channels.map(channel => interaction.guild.channels.cache.get(channel)).join(`\n**•** `)
              : "Kapalı")
        },
        {
          name: '**»** Muaflar',
          value:
            `**•** Kanallar: ${(spamProtection && spamProtection.exempts && spamProtection.exempts.channels && spamProtection.exempts.channels.length > 0) ?
              spamProtection.exempts.channels.map(channel => interaction.guild.channels.cache.get(channel)).join(`, `)
              : `\`Muaf kanal yok\``}\n` +
            `**•** Roller: ${(spamProtection && spamProtection.exempts && spamProtection.exempts.roles && spamProtection.exempts.roles.length > 0) ?
              spamProtection.exempts.roles.map(role => interaction.guild.roles.cache.get(role)).join(`, `)
              : `\`Muaf rol yok\``}\n` +
            `**•** Ek: \`"Mesajları Yönet" yetkisine sahip üyeler\`, \`Nraphy'nin zaman aşımı veremeyeceği üyeler\``
        },
      ],
    };

    const buttonRolePageEmbed = {
      color: client.settings.embedColors.red, //client.settings.embedColors.default,
      author: {
        name: `${interaction.guild.name} Sunucusunun Ayarları (Buton Rol)`,
        icon_url: interaction.guild.iconURL(),
      },
      description: "Bu sayfa bakımdadır. En kısa sürede güncelleme ile düzeltilecektir 😊"
      /*fields: [
        {
          name: '**»** Kelime Oyunu',
          value: `**•** ${wordGame && wordGame.channel ? interaction.guild.channels.cache.get(wordGame.channel) : `\`Kapalı\``}`,
        },
        {
          name: '**»** Sayı Saymaca Oyunu',
          value: `**•** ${countingGame && countingGame.channel ? interaction.guild.channels.cache.get(countingGame.channel) : `\`Kapalı\``}`,
        },
      ],*/
    };

    const giveawaysPageEmbed = {
      color: client.settings.embedColors.red, //client.settings.embedColors.default,
      author: {
        name: `${interaction.guild.name} Sunucusunun Ayarları (Çekilişler)`,
        icon_url: interaction.guild.iconURL(),
      },
      description: "Bu sayfa bakımdadır. En kısa sürede güncelleme ile düzeltilecektir 😊"
      /*fields: [
        {
          name: '**»** Kelime Oyunu',
          value: `**•** ${wordGame && wordGame.channel ? interaction.guild.channels.cache.get(wordGame.channel) : `\`Kapalı\``}`,
        },
        {
          name: '**»** Sayı Saymaca Oyunu',
          value: `**•** ${countingGame && countingGame.channel ? interaction.guild.channels.cache.get(countingGame.channel) : `\`Kapalı\``}`,
        },
      ],*/
    };

    const gamesPageEmbed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${interaction.guild.name} Sunucusunun Ayarları (Oyunlar)`,
        icon_url: interaction.guild.iconURL(),
      },
      fields: [
        {
          name: '**»** Sayı Saymaca Oyunu',
          value: `**•** ${countingGame?.channel ? interaction.guild.channels.cache.get(countingGame.channel) : `\`Kapalı\``}`,
        },
      ],
    };

    const wordGamePageEmbed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${interaction.guild.name} Sunucusunun Ayarları (Kelime Oyunu)`,
        icon_url: interaction.guild.iconURL(),
      },
      title: `**»** ${wordGame && wordGame.channel ? "Aktif!" : "Kapalı"}`,
      fields: [
        {
          name: '**»** Kanal',
          value: `**•** ${wordGame && wordGame.channel ? interaction.guild.channels.cache.get(wordGame.channel) : `\`Kapalı\``}`,
        },
        {
          name: '**»** Ayarlar',
          value:
            `**•** Üst Üste Yazma: \`${wordGame?.writeMore ? `\`Açık\`` : `\`Kapalı\``}\``,
          //`**•** Kelime Geçmişi: \`Bilgi alınamıyor\``,
        },

        {
          name: '**»** İstatistikler',
          value: `**•** \`/sıralama\``,
        },
      ],
    };

    let moderationPageButton = new ButtonBuilder().setLabel('Diğer Moderasyon').setCustomId("moderationPageButton").setStyle('Primary');
    let linkBlockPageButton = new ButtonBuilder().setLabel('Bağlantı Engel').setCustomId("linkBlockPageButton").setStyle('Secondary');
    let upperCaseBlockPageButton = new ButtonBuilder().setLabel('Büyük Harf Engel').setCustomId("upperCaseBlockPageButton").setStyle('Secondary');
    let spamProtectionPageButton = new ButtonBuilder().setLabel('Spam Koruması').setCustomId("spamProtectionPageButton").setStyle('Secondary');
    let buttonRolePageButton = new ButtonBuilder().setLabel('Buton Rol (Bakımda)').setCustomId("buttonRolePageButton").setStyle('Secondary');
    let giveawaysPageButton = new ButtonBuilder().setLabel('Çekilişler (Bakımda)').setCustomId("giveawaysPageButton").setStyle('Secondary');
    let gamesPageButton = new ButtonBuilder().setLabel('Oyunlar Sayfası').setCustomId("gamesPageButton").setStyle('Primary');
    let wordGamePageButton = new ButtonBuilder().setLabel('Kelime Oyunu').setCustomId("wordGamePageButton").setStyle('Secondary');

    await interaction.reply({
      embeds: [moderationPageEmbed],
      components: [
        {
          data: { type: 1 }, components: [moderationPageButton.setDisabled(true), linkBlockPageButton, upperCaseBlockPageButton, spamProtectionPageButton]
        },
        {
          data: { type: 1 }, components: [buttonRolePageButton, giveawaysPageButton]
        },
        {
          data: { type: 1 }, components: [gamesPageButton, wordGamePageButton]
        }
      ]
    });

    const reply = await interaction.fetchReply();
    const filter = i => {
      i.deferUpdate();
      return i.user.id === interaction.user.id && i.message.id === reply.id;
    };

    const collector = reply.createMessageComponentCollector({ filter, time: 180000 });

    collector.on('collect', btn => {

      if (btn.customId === "moderationPageButton") {

        interaction.editReply({
          embeds: [moderationPageEmbed],
          components: [
            {
              data: { type: 1 }, components: [moderationPageButton.setDisabled(true), linkBlockPageButton.setDisabled(false), spamProtectionPageButton.setDisabled(false), buttonRolePageButton.setDisabled(false), giveawaysPageButton.setDisabled(false)]
            },
            {
              data: { type: 1 }, components: [gamesPageButton.setDisabled(false), wordGamePageButton.setDisabled(false)]
            }
          ]
        });

      } else if (btn.customId === "linkBlockPageButton") {

        interaction.editReply({
          embeds: [linkBlockPageEmbed],
          components: [
            {
              data: { type: 1 }, components: [moderationPageButton.setDisabled(false), linkBlockPageButton.setDisabled(true), spamProtectionPageButton.setDisabled(false), buttonRolePageButton.setDisabled(false), giveawaysPageButton.setDisabled(false)]
            },
            {
              data: { type: 1 }, components: [gamesPageButton.setDisabled(false), wordGamePageButton.setDisabled(false)]
            }
          ]
        });

      } else if (btn.customId === "upperCaseBlockPageButton") {

        interaction.editReply({
          embeds: [upperCaseBlockPageEmbed],
          components: [
            {
              data: { type: 1 }, components: [moderationPageButton.setDisabled(false), linkBlockPageButton.setDisabled(true), spamProtectionPageButton.setDisabled(false), buttonRolePageButton.setDisabled(false), giveawaysPageButton.setDisabled(false)]
            },
            {
              data: { type: 1 }, components: [gamesPageButton.setDisabled(false), wordGamePageButton.setDisabled(false)]
            }
          ]
        });

      } else if (btn.customId === "spamProtectionPageButton") {

        interaction.editReply({
          embeds: [spamProtectionPageEmbed],
          components: [
            {
              data: { type: 1 }, components: [moderationPageButton.setDisabled(false), linkBlockPageButton.setDisabled(false), spamProtectionPageButton.setDisabled(true), buttonRolePageButton.setDisabled(false), giveawaysPageButton.setDisabled(false)]
            },
            {
              data: { type: 1 }, components: [gamesPageButton.setDisabled(false), wordGamePageButton.setDisabled(false)]
            }
          ]
        });

      } else if (btn.customId === "buttonRolePageButton") {

        interaction.editReply({
          embeds: [buttonRolePageEmbed],
          components: [
            {
              data: { type: 1 }, components: [moderationPageButton.setDisabled(false), linkBlockPageButton.setDisabled(false), spamProtectionPageButton.setDisabled(false), buttonRolePageButton.setDisabled(true), giveawaysPageButton.setDisabled(false)]
            },
            {
              data: { type: 1 }, components: [gamesPageButton.setDisabled(false), wordGamePageButton.setDisabled(false)]
            }
          ]
        });

      } else if (btn.customId === "giveawaysPageButton") {

        interaction.editReply({
          embeds: [giveawaysPageEmbed],
          components: [
            {
              type: 1, components: [moderationPageButton.setDisabled(false), linkBlockPageButton.setDisabled(false), spamProtectionPageButton.setDisabled(false), buttonRolePageButton.setDisabled(false), giveawaysPageButton.setDisabled(true)]
            },
            {
              type: 1, components: [gamesPageButton.setDisabled(false), wordGamePageButton.setDisabled(false)]
            }
          ]
        });

      } else if (btn.customId === "gamesPageButton") {

        interaction.editReply({
          embeds: [gamesPageEmbed],
          components: [
            {
              data: { type: 1 }, components: [moderationPageButton.setDisabled(false), linkBlockPageButton.setDisabled(false), spamProtectionPageButton.setDisabled(false), buttonRolePageButton.setDisabled(false), giveawaysPageButton.setDisabled(false)]
            },
            {
              data: { type: 1 }, components: [gamesPageButton.setDisabled(true), wordGamePageButton.setDisabled(false)]
            }
          ]
        });

      } else if (btn.customId === "wordGamePageButton") {

        interaction.editReply({
          embeds: [wordGamePageEmbed],
          components: [
            {
              data: { type: 1 }, components: [moderationPageButton.setDisabled(false), linkBlockPageButton.setDisabled(false), spamProtectionPageButton.setDisabled(false), buttonRolePageButton.setDisabled(false), giveawaysPageButton.setDisabled(false)]
            },
            {
              data: { type: 1 }, components: [gamesPageButton.setDisabled(false), wordGamePageButton.setDisabled(true)]
            }
          ]
        });

      }

    });

    collector.on('end', collected => {
      return interaction.editReply({
        components: []
      });
    });

  }
};