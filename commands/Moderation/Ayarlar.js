const axios = require('axios');
const { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "ayarlar",
    description: "Sunucunun ayarlarını gösterir.",
    options: []
  },
  interactionOnly: true,
  aliases: ["settings"],
  category: "Moderation",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageChannels", "ManageWebhooks"],
  nsfw: false,
  cooldown: 10000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    await interaction.deferReply();

    const autoReply = data.guild.autoReply;
    const autoRole = data.guild.autoRole;
    const inviteManager = data.guild.inviteManager;
    const linkBlock = data.guild.linkBlock;
    const memberCounter = data.guild.memberCounter;
    const prefix = data.guild.prefix || client.settings.prefix;
    const spamProtection = data.guild.spamProtection;
    const upperCaseBlock = data.guild.upperCaseBlock;
    const wordGame = data.guild.wordGame;

    //------------------------------HATA TESPİT------------------------------//

    var caughtProblems = [];

    //ButtonRole
    let amountOfButtonsWithError = 0;
    for await (let [messageId, buttonRoleData] of Object.entries(data.guild.buttonRole || {})) {
      //messageId => "1073286862325686322"
      //buttonRoleData => { channelId: "1073286862325686322", title: null... }
      if (!buttonRoleData.channelId || !interaction.guild.channels.cache.get(buttonRoleData.channelId)) {
        delete data.guild.buttonRole[messageId];
        amountOfButtonsWithError++;
      }
    }
    if (amountOfButtonsWithError) {
      data.guild.markModified('buttonRole');
      await data.guild.save();
      caughtProblems.push(`Sorunlu ${amountOfButtonsWithError} adet buton rol mesajı tespit edildi ve veri tabanından silindi. Merak etme, aktif olarak kullanılan buton rollerde bir problem olmayacak.`);
    }

    //Kelime Oyunu
    if (wordGame.channel && !interaction.guild.channels.cache.get(wordGame.channel)) {
      data.guild.wordGame.channel = undefined;
      await data.guild.save();
      caughtProblems.push("Kelime oyunu kanalı bulunamadı. Kelime oyunu kapatıldı. (İstatistikler korunuyor)");
    }

    //Logger
    var logger = data.guild.logger, loggerChannel;
    if (logger?.webhook) {
      await axios
        .get(logger.webhook)
        .then(res => { loggerChannel = res.data.channel_id; })
        .catch(async () => {
          data.guild.logger.webhook = undefined;
          await data.guild.save();
          caughtProblems.push("Log sistemi Webhook'u bulunamadı. Log sistemi kapatıldı.");
        });
    }

    //Warns
    let warns_users = 0, warns_warns = 0;
    if (Object.keys(data.guild.warns || {}).length)
      for await (let warnDataId of Object.keys(data.guild.warns || {})) {
        warns_users++;

        let warnData = data.guild.warns[warnDataId];
        if (warnData.length) warns_warns += warnData.length;
      }

    //"Bir takım problemlerle karşılaşıldı" uyarısı
    if (caughtProblems.length)
      return interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.yellow,
            title: "**»** Bir Takım Problemlerle Karşılaşıldı!",
            description:
              `**•** \`${caughtProblems.join('\`\n**•** \`')}\`\n\n` +

              `**•** Ayarları görmek için lütfen komutu tekrar kullanın.\n` +
              `**•** Bir sorun olduğunu düşünüyorsanız [destek sunucumuza](https://discord.gg/kanov44) gelebilirsiniz.`
          }
        ],
        components: [
          {
            type: 1, components: [
              new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/kanov44").setStyle('Link')
            ]
          },
        ]
      });

    //------------------------------HATA TESPİT------------------------------//

    let moderationPageEmbed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${interaction.guild.name} Sunucusunun Ayarları (Moderasyon)`,
        icon_url: interaction.guild.iconURL(),
      },
      title: `**»** Prefix: \`${prefix !== client.settings.prefix ? prefix : `${client.settings.prefix} (Varsayılan)`}\``,
      fields: [
        {
          name: '**»** Davet Sistemi',
          value: `**•** ${inviteManager.channel ? `Kanal: ${interaction.guild.channels.cache.get(inviteManager.channel)}` : `\`Kapalı\``}`,
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
          value: `**•** ${memberCounter.channel ? `Kanal: ${interaction.guild.channels.cache.get(memberCounter.channel)}\n**•** Hedef: \`${memberCounter.target}\`` : `\`Kapalı\``}`,
        },
        {
          name: '**»** Log Sistemi',
          value:
            `**•** ${loggerChannel ? `Kanal: ${interaction.guild.channels.cache.get(loggerChannel)}` : `\`Kapalı\``}\n` +
            `**•** NABER PİSLİK.`,
        },
        {
          name: '**»** Bilgi ⚠️',
          value:
            `**•** Bu bot kanove1913 tarafından oluşturulmuştur.\n` +
            `**•** O GERÇEK BİR KRAL EMAANNN.\n` +
            `**•** HERŞEYİ İSTİOSANIZ KANOVEYE YAZINIZ CANLARIM.\n` +
            `**•** [KANOVEYE İTAAT EDİN SİKERİM)\n\n` +

            `**•** İsim Temizleme Sistemi\n` +
            `**•** Kampanya Haber\n` +
            `**•** Galeri Sistemi\n` +
            `**•** Uyarı Sistemi\n` +
            `**•** ve daha fazlası...`,
        },
      ],
    };

    //Row
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Buradan kategori seçebilirsin')
          .addOptions([
            {
              label: 'Diğer Moderasyon',
              value: 'moderationPageOption',
              description: 'Davet Sistemi, Oto-Cevap, Oto-Rol, Sayaç, Kampanya Haber, Log, Galeri, Uyarılar, İsim Temizleme',
              emoji: '📘'
            },
            {
              label: 'Bağlantı Engel',
              value: 'linkBlockPageOption',
              //description: '',
              emoji: '📘'
            },
            {
              label: 'Büyük Harf Engel',
              value: 'upperCaseBlockPageOption',
              //description: '',
              emoji: '📘'
            },
            {
              label: 'Spam Koruması',
              value: 'spamProtectionPageOption',
              //description: '',
              emoji: '📘'
            },
            {
              label: 'Buton Rol (Bakımda)',
              value: 'buttonRolePageOption',
              //description: '',
              emoji: '📘'
            },
            {
              label: 'Oyunlar Sayfası',
              value: 'gamesPageOption',
              description: 'Kelime Oyunu, Sayı Saymaca ve Tuttu Tutmadı',
              emoji: '📕'
            },
          ])
      );

    await interaction.editReply({
      embeds: [moderationPageEmbed],
      components: [row]
    });

    const reply = await interaction.fetchReply();
    const filter = i => {
      return i.message.id === reply.id && i.deferUpdate() && i.user.id === interaction.user.id;
    };

    const collector = reply.createMessageComponentCollector({ filter, time: 600000 });

    collector.on('collect', async int => {

      let collectedOption = row.components[0].options.find(selectMenuOption => selectMenuOption.data.value == int.values.toString());
      row.components[0].setPlaceholder(`${collectedOption.data.emoji.name} ${collectedOption.data.label}`);

      if (int.values.toString() === "moderationPageOption") {

        interaction.editReply({
          embeds: [moderationPageEmbed],
          components: [row]
        });

      } else if (int.values.toString() === "linkBlockPageOption") {

        interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.default,
              author: {
                name: `${interaction.guild.name} Sunucusunun Ayarları (Bağlantı Engel)`,
                icon_url: interaction.guild.iconURL(),
              },
              title: `**»** ${linkBlock?.guild ? "Açık!" : "Kapalı"}`,
              fields: [
                {
                  name: '**»** Muaflar',
                  value:
                    `**•** Kanallar: ${linkBlock?.exempts?.channels?.length > 0
                      ? linkBlock.exempts.channels.map(channel => interaction.guild.channels.cache.get(channel)).join(`, `)
                      : `\`Muaf kanal yok\``}\n` +
                    `**•** Roller: ${linkBlock?.exempts?.roles?.length > 0
                      ? linkBlock.exempts.roles.map(role => interaction.guild.roles.cache.get(role)).join(`, `)
                      : `\`Muaf rol yok\``}\n` +
                    `**•** Bağlantılar: \`GIPHY, Tenor, GIBIRNet\` (Düzenleme şimdilik mevcut değil)\n` +
                    `**•** Ek: \`"Mesajları Yönet" yetkisine sahip üyeler\``
                },
              ],
            }
          ],
          components: [row]
        });

      } else if (int.values.toString() === "upperCaseBlockPageOption") {

        interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.default,
              author: {
                name: `${interaction.guild.name} Sunucusunun Ayarları (Büyük Harf Engel)`,
                icon_url: interaction.guild.iconURL(),
              },
              title: `**»** ${upperCaseBlock?.guild ? "Açık!" : "Kapalı"}`,
              fields: [
                {
                  name: '**»** Büyük Harf Oranı',
                  value: `**•** ${upperCaseBlock.rate ? `\`%${upperCaseBlock.rate}\`` : `\`Varsayılan (%70)\``}`
                },
                {
                  name: '**»** Muaflar',
                  value:
                    `**•** Kanallar: ${upperCaseBlock?.exempts?.channels?.length > 0
                      ? upperCaseBlock.exempts.channels.map(channel => interaction.guild.channels.cache.get(channel)).join(`, `)
                      : `\`Muaf kanal yok\``}\n` +
                    `**•** Roller: ${upperCaseBlock?.exempts?.roles?.length > 0
                      ? upperCaseBlock.exempts.roles.map(role => interaction.guild.roles.cache.get(role)).join(`, `)
                      : `\`Muaf rol yok\``}\n` +
                    `**•** Ek: \`"Mesajları Yönet" yetkisine sahip üyeler\``
                },
              ],
            }
          ],
          components: [row]
        });

      } else if (int.values.toString() === "spamProtectionPageOption") {

        interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.default,
              author: {
                name: `${interaction.guild.name} Sunucusunun Ayarları (Spam Koruması)`,
                icon_url: interaction.guild.iconURL(),
              },
              title: `**»** ${spamProtection.guild ? "Açık!" : "Kapalı"}`,
              fields: [
                {
                  name: '**»** Muaflar',
                  value:
                    `**•** Kanallar: ${spamProtection?.exempts?.channels?.length > 0
                      ? spamProtection.exempts.channels.map(channel => interaction.guild.channels.cache.get(channel)).join(`, `)
                      : `\`Muaf kanal yok\``}\n` +
                    `**•** Roller: ${spamProtection?.exempts?.roles?.length > 0
                      ? spamProtection.exempts.roles.map(role => interaction.guild.roles.cache.get(role)).join(`, `)
                      : `\`Muaf rol yok\``}\n` +
                    `**•** Ek: \`"Mesajları Yönet" yetkisine sahip üyeler\`, \`kanove'nin zaman aşımı veremeyeceği üyeler\``
                },
              ],
            }
          ],
          components: [row]
        });

      } else if (int.values.toString() === "buttonRolePageOption") {

        interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.red, //client.settings.embedColors.default,
              author: {
                name: `${interaction.guild.name} Sunucusunun Ayarları (Buton Rol)`,
                icon_url: interaction.guild.iconURL(),
              },
              description: "Bu sayfa bakımdadır. En kısa sürede güncelleme ile düzeltilecektir 😊"
            }
          ],
          components: [row]
        });

      } else if (int.values.toString() === "giveawaysPageOption") {

        interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.default,
              author: {
                name: `${interaction.guild.name} Sunucusunun Ayarları (Çekilişler)`,
                icon_url: interaction.guild.iconURL(),
              },
              description:
                `**•** Bu bot kanove1913 tarafından oluşturulmuştur.\n` +
                `**•** O GERÇEK BİR KRAL EMAANNN.\n` +
                `**•** HERŞEYİ İSTİOSANIZ KANOVEYE YAZINIZ CANLARIM.\n` +
                `**•** KANOVEYE İTAAT EDİN SİKERİM`
            }
          ],
          components: [row]
        });

      } else if (int.values.toString() === "gamesPageOption") {

        interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.default,
              author: {
                name: `${interaction.guild.name} Sunucusunun Ayarları (Oyunlar)`,
                icon_url: interaction.guild.iconURL(),
              },
              fields: [
                {
                  name: '**»** Kelime Oyunu',
                  value:
                    wordGame?.channel ?
                      `**•** Kanal: ${interaction.guild.channels.cache.get(wordGame.channel)}\n` +
                      `**•** Üst Üste Yazma: \`${wordGame?.writeMore ? `Açık` : `Kapalı`}\``
                      : `**•** \`Kapalı\``,
                },
                {
                  name: '**»** Sayı Saymaca Oyunu 🔒',
                  value: `**•** \`NABER PİSLİKKKK\``,
                },
                {
                  name: '**»** Tuttu Tutmadı Oyunu 🔒',
                  value: `**•** \`NABER PİSLİKKKK\``,
                },
                {
                  name: '**»** Bilgi ⚠️',
                  value:
                    `**•** Bu bot kanove1913 tarafından oluşturulmuştur.\n` +
                    `**•**  O GERÇEK BİR KRAL EMAANNN.\n` +
                    `**•** HERŞEYİ İSTİOSANIZ KANOVEYE YAZINIZ CANLARIM.\n` +
                    `**•** KANOVEYE İTAAT EDİN SİKERİM`,
                },
              ],
            }
          ],
          components: [row]
        });

      }
    });

    collector.on('end', collected => {
      return interaction.editReply({
        components: []
      }).catch(e => { });
    });

  }
};