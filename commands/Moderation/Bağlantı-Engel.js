const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "bağlantı-engel",
    description: "Sunucunuzdaki üyelerin link paylaşmasını engeller.",
    options: [
      {
        name: "bilgi",
        description: "Bağlantı engelleme sistemi hakkında tüm bilgileri sağlar.",
        type: 1,
        options: []
      },
      {
        name: "aç",
        description: "Bağlantı engelleme sistemini açar.",
        type: 1,
        options: []
      },
      {
        name: "muaf",
        description: "Bağlantı engel sistemine seçtiğiniz rolü/kanalı muaf tutar.",
        type: 2,
        options: [
          {
            name: "kanal",
            description: "Muaf tutulmasını istediğin kanalı gir.",
            type: 1,
            options: [
              {
                name: "işlem",
                description: "Seçtiğin kanal muaf listesine eklensin mi/kaldırılsın mı?",
                choices: [
                  { name: "Ekle", value: "ekle" },
                  { name: "Kaldır", value: "kaldir" }
                ],
                type: 3,
                required: true
              },
              {
                name: "kanal",
                description: "İşlem yapılacak kanalı seç.",
                type: 7,
                required: true
              }
            ]
          },
          {
            name: "rol",
            description: "Muaf tutulmasını istediğin rolü gir.",
            type: 1,
            options: [
              {
                name: "işlem",
                description: "Seçtiğin rol muaf listesine eklensin mi/kaldırılsın mı?",
                choices: [
                  { name: "Ekle", value: "ekle" },
                  { name: "Kaldır", value: "kaldir" }
                ],
                type: 3,
                required: true
              },
              {
                name: "rol",
                description: "İşlem yapılacak rolü seç.",
                type: 8,
                required: true
              }
            ]
          },
          /*{
            name: "bağlantı",
            description: "zart zurt",
            type: 1,
            options: [
              {
                name: "işlem",
                description: "qurv",
                choices: [
                  { name: "ekle", value: "ekle" },
                  { name: "kaldır", value: "kaldir" }
                ],
                type: 3,
                required: true
              },
              {
                name: "bağlantı",
                description: "gart gurt",
                type: 3,
                required: true
              }
            ]
          },*/
        ]
      },
      {
        name: "kapat",
        description: "Bağlantı engelleme sistemini kapatır yani sıfırlar.",
        type: 1,
        options: []
      }
    ],
  },
  interactionOnly: true,
  aliases: ["bağlantıengel", "linkengel", "adblock", "link-engel", 'reklam', 'reklam-engeli', 'reklam-engelleme', 'reklamengel', 'reklamengelleme', 'reklamengeli', "reklamkoruması", "reklam-koruması"],
  category: "MessageFilters",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageMessages"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const getSubcommand = interaction.options.getSubcommandGroup(false);
    const getCommand = interaction.options.getSubcommand();
    const linkBlock = data.guild.linkBlock;

    //------------------------------Bilgi------------------------------//
    if (getCommand == "bilgi") {

      const destekSunucusuButon = new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link');

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Bağlantı Engelleme (Reklam Engel) Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Bağlantı Engelleme Sistemi Nedir?',
                value: `**•** Bağlantı engelleme sistemini açtığınızda; sunucunuzdaki üyeler herhangi bir kanala bağlantı içeren bir mesaj attığında mesajı silinir.`,
              },
              {
                name: '**»** Bağlantı Engelleme Sistemi Nasıl Açılır?',
                value:
                  `**•** \`/bağlantı-engel Aç\``
              },
              {
                name: '**»** Muaf Kanallar ve Muaf Roller Nasıl Ayarlanır?',
                value:
                  `**•** \`/bağlantı-engel Muaf Kanal <#Kanal>\`\n` +
                  `**•** \`/bağlantı-engel Muaf Rol <@Rol>\``
              },
              {
                name: '**»** Ayarladığım Bağlantı Engelleme Ayarlarını Nasıl Görürüm?',
                value: `**•** \`/ayarlar\` yazıp alttaki seçeneklerden **Bağlantı Engel**'e tıklayarak her detayı görebilirsiniz.`,
              },
              {
                name: '**»** Bağlantı Engelleme Sistemi Nasıl Kapatılır?',
                value: `**•** \`/bağlantı-engel Kapat\``,
              },
              {
                name: '**»** Hangi Bağlantılar Engellenir, Hangi Bağlantılar İstisnadır?',
                value:
                  `**•** Aşağıdakiler hariç tüm bağlantılar (Discord, Youtube, Google vb. dahil) engellenir.\n` +
                  `**•** **GIPHY**, **Tenor** ve **GIBIRNet** bağlantıları istisnalar içerisindedir, yani engellenmezler.`,
              },
              {
                name: '**»** Kimler Bu Korumadan Muaf Tutulur?',
                value: `**•** **Mesajları Yönet** yetkisine sahip sunucu yetkilileri ve ayarladığınız muaf rollerine sahip üyeler bu korumadan muaf tutulurlar.`
              },
              {
                name: '**»** Tüm Bunlara Rağmen Ben Anlamadım Arkadaş!',
                value: `**•** Aşağıdaki butondan gel [destek sunucumuza](https://discord.gg/QvaDHvuYVm), yardımcı olalım. Aklına takılan nedir?`
              },
            ],
          }
        ],
        components: [
          {
            type: 1, components: [destekSunucusuButon]
          },
        ]
      });

      //------------------------------Aç------------------------------//
    } else if (getCommand == "aç") {

      if (linkBlock?.guild)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bağlantı Engelleme Sistemi Zaten Sunucu Genelinde Açık!',
              description: `**•** Kapatmak için \`/bağlantı-engel Kapat\` yazabilirsin.`
            }
          ]
        });

      data.guild.linkBlock.guild = true;
      await data.guild.save();

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Bağlantı Engelleme Sistemi Açıldı!',
            description: `**•** Muaflar ve diğer bilgiler için \`/bağlantı-engel Bilgi\` yazabilirsin.`
          }
        ]
      });

      //------------------------------Muaf------------------------------//
    } else if (getSubcommand == "muaf") {

      const getOperation = interaction.options.getString("işlem");

      if (getCommand == "kanal") {

        const getChannel = interaction.options.getChannel("kanal");

        if (getOperation == "ekle") {

          if (linkBlock && !linkBlock.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Sadece Seçtiğin Kanallarda Koruma Mevcut Ki Zaten!`,
                  description: `**•** Muaf eklemek yerine bu kanalı seçtiğin kanallardan kaldırabilirsin.`,
                }
              ],
              ephemeral: true
            });

          if (linkBlock?.exempts?.channels && linkBlock.exempts.channels.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Belirttiğin Kanal Zaten Muaf Listesinde Mevcut!`,
                  description: `**•** Yardıma ihtiyacın olursa \`/bağlantı-engel Bilgi\` yazabilirsin.`,
                }
              ],
              ephemeral: true
            });

          data.guild.linkBlock.exempts.channels.push(getChannel.id);
          data.guild.markModified('linkBlock.exempts.channels');
          await data.guild.save();

          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`#${getChannel.name}\` Başarıyla Muaf Listesine Eklendi!`,
                description: `**•** Yardıma ihtiyacın olursa \`/bağlantı-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        } else if (getOperation == "kaldir") {

          if (!linkBlock?.exempts?.channels || linkBlock.exempts.channels.length == 0)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Muaf Listesinde Bir Kanal Bile Yok Ki!`,
                  description: `**•** Olayı yanlış anladın bence sen \`/bağlantı-engel Bilgi\``,
                }
              ],
              ephemeral: true
            });

          if (!linkBlock.exempts.channels.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Anlamadım Seni. Bu Kanal Zaten Muaf Listesinde Değil Ki!`,
                  description: `**•** Yardım lazımsa \`/bağlantı-engel Bilgi\` yaz, ben yetişirim sana.`,
                }
              ],
              ephemeral: true
            });

          linkBlock.exempts.channels.splice(linkBlock.exempts.channels.indexOf(getChannel.id), 1);

          data.guild.linkBlock.exempts.channels = linkBlock.exempts.channels;
          data.guild.markModified('linkBlock.exempts.channels');
          await data.guild.save();

          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`#${getChannel.name}\` Başarıyla Muaf Listesinden Kaldırıldı!`,
                description: `**•** Yardıma ihtiyacın olursa \`/bağlantı-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        }

      } else if (getCommand == "rol") {

        const getRole = interaction.options.getRole("rol");

        if (getOperation == "ekle") {

          if (linkBlock?.exempts?.roles && linkBlock.exempts.roles.includes(getRole.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Belirttiğin Rol Zaten Muaf Listesinde Mevcut!`,
                  description: `**•** Yardıma ihtiyacın olursa \`/bağlantı-engel Bilgi\` yazabilirsin.`,
                }
              ],
              ephemeral: true
            });

          data.guild.linkBlock.exempts.roles.push(getRole.id);
          data.guild.markModified('linkBlock.exempts.roles');
          await data.guild.save();

          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`@${getRole.name}\` Başarıyla Muaf Listesine Eklendi!`,
                description: `**•** Yardıma ihtiyacın olursa \`/bağlantı-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        } else if (getOperation == "kaldir") {

          if (!linkBlock?.exempts?.roles || linkBlock.exempts.roles.length == 0)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Muaf Listesinde Bir Rol Bile Yok Ki!`,
                  description: `**•** Olayı yanlış anladın bence sen \`/bağlantı-engel Bilgi\``,
                }
              ],
              ephemeral: true
            });

          if (!linkBlock.exempts.roles.includes(getRole.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Anlamadım Seni. Bu Rol Zaten Muaf Listesinde Değil Ki!`,
                  description: `**•** Yardım lazımsa \`/bağlantı-engel Bilgi\` yaz, ben yetişirim sana.`,
                }
              ],
              ephemeral: true
            });

          linkBlock.exempts.roles.splice(linkBlock.exempts.roles.indexOf(getRole.id), 1);

          data.guild.linkBlock.exempts.roles = linkBlock.exempts.roles;
          data.guild.markModified('linkBlock.exempts.roles');
          await data.guild.save();

          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`@${getRole.name}\` Başarıyla Muaf Listesinden Kaldırıldı!`,
                description: `**•** Yardıma ihtiyacın olursa \`/bağlantı-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        }

      } /*else if (getCommand == "bağlantı") {

        const getLink = interaction.options.getString("bağlantı");

        if (getOperation == "ekle") {

          if (linkBlock && linkBlock.exempts && linkBlock.exempts.links && linkBlock.exempts.links.includes(getLink))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Belirttiğin Kanal Zaten Muaf Listesinde Mevcut!`,
                  description: `**•** Yardıma ihtiyacın varsa \`/bağlantı-engel Bilgi\` yazabilirsin.`,
                }
              ],
              ephemeral: true
            });

          db.push(`guilds.${interaction.guild.id}.linkBlock.exempts.links`, getLink)
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`#${getRole.name}\` Başarıyla Muaf Listesine Eklendi!`,
                description: `**•** Yardıma ihtiyacın olursa \`/bağlantı-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        } else if (getOperation == "kaldir") {

          interaction.reply({ content: `muaf kaldırma basarisiz :-1: ${getLink}` })

        }

      }*/

      //------------------------------Kapat------------------------------//
    } else if (getCommand == "kapat") {

      if (!linkBlock.guild)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bağlantı Engelleme Sistemi Zaten Kapalı!',
              description: `**•** Yardıma ihtiyacın varsa \`/bağlantı-engel Bilgi\` yazabilirsin.`
            }
          ]
        });

      data.guild.linkBlock.guild = undefined;
      await data.guild.save();

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Bağlantı Engelleme Sistemi Kapatıldı!',
            description: `**•** Artık sunucudaki üyeler bağlantı paylaşabilir.`
          }
        ]
      });

    }

  }
};