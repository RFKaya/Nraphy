const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "log",
    description: "Log sistemiyle ilgili tüm komutlar.",
    options: [
      {
        name: "bilgi",
        description: "Log sistemi hakkında bilgi verir.",
        type: 1,
        options: []
      },
      {
        name: "ayarla",
        description: "Log sisteminin kanalını ayarlar.",
        type: 1,
        options: [
          {
            name: "kanal",
            description: "Logların iletileceği kanalı seç.",
            type: 7,
            required: true
          }
        ]
      },
      {
        name: "akıllı-filtreler",
        description: "Gereksiz sayılabilecek logları (Bot mesajlarını vb.) görmezden gelir.",
        type: 1,
        options: [
          {
            name: "işlem",
            description: "Akıllı filtreler açılsın mı?",
            choices: [
              { name: "Aç", value: "ac" },
              { name: "Kapat", value: "kapat" }
            ],
            type: 3,
            required: true
          },
        ]
      },
      {
        name: "kapat",
        description: "Log sistemini kapatır.",
        type: 1,
        options: []
      },
    ],
  },
  interactionOnly: true,
  aliases: ["logger"],
  category: "Moderation",
  memberPermissions: ["Administrator"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageGuild", "ViewAuditLog", "ManageWebhooks"],
  cooldown: 10000,

  async execute(client, interaction, data) {

    const getCommand = interaction.options.getSubcommand();

    if (getCommand == "bilgi") {

      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Log Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Log Sistemi Nedir, Ne İşe Yarar?',
                value: `**•** Sunucudaki olayların kayıtlarını ayarladığınız kanalda bildirir. Örneğin düzenlenen bir mesajın düzenlenmeden önceki hâlini, silinen mesajın içeriğini vb.`,
              },
              {
                name: '**»** Log Sistemi Hangi Olayları Bildirir?',
                value:
                  `**•** \`Mesaj düzenleme ve silme (İçerikleriyle birlikte)\`\n` +
                  `**•** Log sisteminin nihai sürümü yalnızca Resmî Nraphy botunda mevcuttur.`,
              },
              {
                name: '**»** Gereksiz Birçok Logdan Kurtulmak İstiyorum!',
                value:
                  `**•** O zaman sana akıllı filtreleri verelim. Akıllı filtreleri açarsan aşağıdaki loglar bildirilmeyecek, böylelikle log kanalın gereksiz yere meşgul edilmeyecek.\n\n` +

                  `**•** \`Botlara ait mesajlar (Silinme, düzenlenme)\`\n` +
                  //`**•** \`Log kanalında gönderilen mesajlar (Silinme, düzenlenme)\`\n` +
                  `**•** \`Şimdilik bu kadar.\``,
              },
              {
                name: '**»** Log Sistemi Nasıl Açılır/Kapatılır?',
                value:
                  `**•** \`/log Ayarla\` komutuyla log kanalını ayarlayabilirsin.\n` +
                  `**•** \`/log Kapat\` komutuyla kapatabilirsin.`,
              },
            ],
            image: {
              url: "https://cdn.discordapp.com/attachments/892082183710330950/994300796638347445/unknown.png"
            }
          }
        ],
      });

    } else if (getCommand == "ayarla") {

      const getChannel = interaction.options.getChannel("kanal");

      //Kanal Kontrol
      if (!await client.functions.channelChecker(interaction, getChannel, ["ViewChannel", "SendMessages", "EmbedLinks", "ManageChannels", "ManageWebhooks"])) return;

      await interaction.deferReply();

      //Zaten o kanalda aktif mi?
      if (data.guild.logger?.webhook && (await getChannel.fetchWebhooks()).find(webhook => webhook.url === data.guild.logger.webhook))
        return interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** O Kanalda Zaten Bu Sistem Aktif!',
              description: `**•** Bir sorun mu var? Destek sunucumuza gelebilirsin :)`
            }
          ],
          components: [
            {
              data: { type: 1 }, components: [
                new ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')
              ]
            },
          ]
        });

      const webhook = await getChannel.createWebhook({
        name: 'Nraphy Logger',
        avatar: 'https://media.discordapp.net/attachments/727501328519004200/910108789796110346/Nraphy-Test-Logo-Kare.png',
        reason: `Nraphy Log Sistemi • ${interaction.user.tag} tarafından açıldı.`
      }).catch(err => {
        client.logger.error(err);
        return interaction.editReply(`Log kanalını ayarlayamadım. Yetkilerimle ilgili bir sorun olabilir. Çözemezsen destek sunucumuzda bildirebilirsin.\n\nhttps://discord.gg/QvaDHvuYVm`);
      });

      data.guild.logger = { webhook: webhook.url, smartFilters: true };
      data.guild.markModified('logger');
      await data.guild.save();

      return interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: `**»** Log Sistemi \`#${getChannel.name}\` Kanalına Ayarlandı!`,
            url: getChannel.url,
            description:
              `**•** Bir mesaj yazıp silerek log sistemini deneyebilirsin :)\n\n` +

              `**•** **Not:** Log sistemi önemli bir kanaldır. Kanalın, sadece yetkililer tarafından görülebilecek şekilde kısıtlandığından emin ol. Ayrıca kötü niyetli yetkililer, logları yok etmek isteyebileceği için hiçbir yetkiliye log kanalında mesaj silme yetkisinin verilmemesi tavsiye edilir.`
          }
        ]
      });

    } else if (getCommand == "akıllı-filtreler") {

      if (!data.guild.logger.webhook)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Log Sistemi Kapalıyken Akıllı Filtreleri Ne Yapacaksın?',
              description: `**•** Bir sorun mu var? Destek sunucumuza gelebilirsin :)`
            }
          ],
          components: [
            {
              data: { type: 1 }, components: [
                new ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')
              ]
            },
          ]
        });

      const getOperation = interaction.options.getString("işlem");
      if (getOperation == "ac") {

        if (data.guild.logger.smartFilters)
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Akıllı Filtreler Zaten Açık!',
                description: `**•** Bir sorun mu var? Destek sunucumuza gelebilirsin :)`
              }
            ],
            components: [
              {
                data: { type: 1 }, components: [
                  new ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')
                ]
              },
            ]
          });

        data.guild.logger.smartFilters = true;
        await data.guild.save();

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: `**»** Log Sistemi Üzerinde Akıllı Filtreler Açıldı!`,
              description:
                `**•** Artık aşağıdaki türden logları otomatik olarak filtreleyeceğim:\n\n` +

                `**•** Botlara ait mesajlar (Silinme, düzenlenme)\n` +
                //`**•** Log kanalında gönderilen mesajlar (Silinme, düzenlenme)\n` +
                `**•** Şimdilik bu kadar.`,
            }
          ]
        });

      } else if (getOperation == "kapat") {

        if (!data.guild.logger.smartFilters)
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Akıllı Filtreler Zaten Kapalı!',
                description: `**•** Bir sorun mu var? Destek sunucumuza gelebilirsin :)`
              }
            ],
            components: [
              {
                data: { type: 1 }, components: [
                  new ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')
                ]
              },
            ]
          });

        data.guild.logger.smartFilters = false;
        await data.guild.save();

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: `**»** Log Sistemi Üzerinde Akıllı Filtreler Kapatıldı!`,
              description: `**•** Artık bazı logları otomatik olarak filtrelemeyeceğim.`
            }
          ]
        });

      }

    } else if (getCommand == "kapat") {

      return interaction.reply("Kapatma henüz mevcut değil. Kanal ayarlarına gir webhook'u sil.");

    }

  }
};