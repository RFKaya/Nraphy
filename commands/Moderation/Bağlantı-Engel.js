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
        name: "ayarla",
        description: "Bağlantı engelleme sistemininin ayarlarını ayarlar.",
        type: 2,
        options: [
          {
            name: "sunucu",
            description: "Bağlantı engel sistemini sunucu genelinde çalışacak şekilde ayarlar.",
            type: 1,
            options: [
              {
                name: "işlem",
                description: "Koruma, sunucu geneline açılsın mı/kapatılsın mı?",
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
            name: "kanal",
            description: "Bağlantı engelleme sisteminin çalışacağı kanalları seçmenize yarar.",
            type: 1,
            options: [
              {
                name: "işlem",
                description: "Seçtiğin kanal koruma listesine eklensin mi/kaldırılsın mı?",
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
        ]
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
  category: "Moderation",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageMessages"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const getSubcommand = interaction.options.getSubcommandGroup(false);
    const getCommand = interaction.options.getSubcommand();
    const linkBlock = data.guild.linkBlock;//db.fetch(`guilds.${interaction.guild.id}.linkBlock`)

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
                name: '**»** Sunucu Geneli ya da Belirli Kanallar Nedir?',
                value: `**•** Bağlantı engelleme sistemini sunucudaki tüm kanallar için veya sadece seçtiğiniz kanallar için çalışacak şekilde ayarlayabilirsiniz.`,
              },
              {
                name: '**»** Bağlantı Engelleme Sistemi Nasıl Açılır?',
                value:
                  `**•** Sunucu geneli için: \`/bağlantı-engel Ayarla Sunucu Aç\`\n` +
                  `**•** Belirli kanallar için: \`/bağlantı-engel Ayarla Kanal <#Kanal>\``,
              },
              {
                name: '**»** Muaf Kanallar ve Muaf Roller Nasıl Ayarlanır?',
                value: `**•** \`/bağlantı-engel Muaf Kanal <#Kanal>\`\n**•** \`/bağlantı-engel Muaf Rol <@Rol>\``
              },
              {
                name: '**»** Ayarladığım Bağlantı Engelleme Ayarlarını Nasıl Görürüm?',
                value: `**•** \`/ayarlar\` yazıp alttaki butonlardan **Bağlantı Engel**'e tıklayarak her detayı görebilirsiniz.`,
              },
              {
                name: '**»** Bağlantı Engelleme Sistemi Nasıl Kapatılır?',
                value: `**•** \`/bağlantı-engel Kapat\``,
              },
              {
                name: '**»** Sunucu Genelinde Geçerli Korumayı Belirli Kanallarda Çalışacak Şekile Taşıma',
                value: `**•** \`/bağlantı-engel Ayarla Sunucu Kapat\` yazarak bunu yapabilirsiniz. Böylece muaf ayarlarınız korunur.`,
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

      //------------------------------Ayarla - Sunucu------------------------------//
    } else if (getSubcommand == "ayarla") {

      if (getCommand == "sunucu") {

        const getOperation = interaction.options.getString("işlem");

        if (getOperation == "ac") {

          if (linkBlock && linkBlock.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Bağlantı Engelleme Sistemi Zaten Sunucu Genelinde Açık!',
                  description: `**•** Kapatmak için \`/bağlantı-engel Kapat\` yazabilirsin.`
                }
              ]
            });

          //db.set(`guilds.${interaction.guild.id}.linkBlock.guild`, true)
          data.guild.linkBlock.guild = true;
          data.guild.markModified('linkBlock.guild');
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

        } else if (getOperation == "kapat") {

          if (!linkBlock)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Bağlantı Engelleme Sistemi Zaten Kapalı!!',
                  description: `**•** Detaylı bilgi almak için \`/bağlantı-engel Bilgi\` yazabilirsin.`
                }
              ]
            });

          if (!linkBlock.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Bağlantı Engelleme Sistemi Zaten Belirli Kanallarda Açık!',
                  description: `**•** Detaylı bilgi almak için \`/bağlantı-engel Bilgi\` yazabilirsin.`
                }
              ]
            });

          //db.set(`guilds.${interaction.guild.id}.linkBlock.guild`, false)
          data.guild.linkBlock.guild = false;
          data.guild.markModified('linkBlock.guild');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: '**»** Bağlantı Engelleme Sistemi Sunucu Genelinde Kapatıldı!',
                description: `**•** Sistemle ilgili bilgi almak için \`/bağlantı-engel Bilgi\` yazabilirsin.`
              }
            ]
          });

        }

        //------------------------------Ayarla - Kanal------------------------------//
      } else if (getCommand == "kanal") {

        const getOperation = interaction.options.getString("işlem");
        const getChannel = interaction.options.getChannel("kanal");

        if (!getChannel.type == 0)
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: `**»** Geçerli Bir Kanal Belirtmelisin!`,
                description: `**•** Belirttiğin kanal, oda veya kategori olmamalı. Sadece yazı kanalı.`,
              }
            ],
            ephemeral: true
          });

        if (getOperation == "ekle") {

          if (linkBlock && linkBlock.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Bağlantı Engelleme Sistemi Zaten Sunucu Genelinde Açık!`,
                  description: `**•** Belirttiğin kanal da otomatik olarak koruma dahilinde oluyor.`,
                }
              ],
              ephemeral: true
            });

          if (linkBlock && linkBlock.channels && linkBlock.channels.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Belirttiğin Kanal Zaten Bağlantı Koruması Altında!`,
                  description: `**•** Detaylı bilgi almak için \`/bağlantı-engel Bilgi\` yazabilirsin.`,
                }
              ],
              ephemeral: true
            });

          //db.push(`guilds.${interaction.guild.id}.linkBlock.channels`, getChannel.id)
          data.guild.linkBlock.channels.push(getChannel.id);
          data.guild.markModified('linkBlock.channels');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** Belirttiğin Kanal Artık Koruma Altında!`,
                description: `**•** Yardıma ihtiyacın olursa \`/bağlantı-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        } else if (getOperation == "kaldir") {

          if (linkBlock && linkBlock.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Sanırsam Muaf Demek İstedin Çünkü Şu An Tüm Sunucu Koruma Altında!`,
                  description: `**•** Muaf listesine eklemek/kaldırmak istiyosan /bağlantı-engel Muaf Kanal Ekle <#kanal>`,
                }
              ],
              ephemeral: true
            });

          if (!linkBlock || !linkBlock.channels || linkBlock.channels.length == 0)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Hiçbir Kanal Koruma Altında Değil ki!`,
                  description: `**•** Olayı yanlış anladın bence sen \`/bağlantı-engel Bilgi\``,
                }
              ],
              ephemeral: true
            });

          if (!linkBlock.channels.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Anlamadım Seni. Bu Kanal Zaten Koruma Altında Değil Ki!`,
                  description: `**•** Yardım lazımsa \`/bağlantı-engel Bilgi\` yaz, ben yetişirim sana.`,
                }
              ],
              ephemeral: true
            });

          if (linkBlock.channels.length == 1)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Koruma Listesindeki Kalan Son Kanalı Listeden Çıkkaramazsın!`,
                  description: `**•** Önce başka kanal ekle veya direkt sistemi kapat. \`/bağlantı-engel Bilgi\``,
                }
              ],
              ephemeral: true
            });

          linkBlock.channels.splice(linkBlock.channels.indexOf(getChannel.id), 1);

          //db.set(`guilds.${interaction.guild.id}.linkBlock.channels`, linkBlock.channels)
          data.guild.linkBlock.channels = linkBlock.channels;
          data.guild.markModified('linkBlock.channels');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`#${getChannel.name}\` Başarıyla Koruma Listesinden Kaldırıldı!`,
                description: `**•** Yardıma ihtiyacın olursa \`/bağlantı-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        }

      }

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

          if (linkBlock && linkBlock.exempts && linkBlock.exempts.channels && linkBlock.exempts.channels.includes(getChannel.id))
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

          //db.push(`guilds.${interaction.guild.id}.linkBlock.exempts.channels`, getChannel.id)
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

          if (!linkBlock || !linkBlock.exempts || !linkBlock.exempts.channels || linkBlock.exempts.channels.length == 0)
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

          //db.set(`guilds.${interaction.guild.id}.linkBlock.exempts.channels`, linkBlock.exempts.channels)
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

          if (linkBlock && linkBlock.exempts && linkBlock.exempts.roles && linkBlock.exempts.roles.includes(getRole.id))
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

          //db.push(`guilds.${interaction.guild.id}.linkBlock.exempts.roles`, getRole.id)
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

          if (!linkBlock || !linkBlock.exempts || !linkBlock.exempts.roles || linkBlock.exempts.roles.length == 0)
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

          //db.set(`guilds.${interaction.guild.id}.linkBlock.exempts.roles`, linkBlock.exempts.roles)
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

      if (!linkBlock.guild && !linkBlock.channels.length)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bağlantı Engelleme Sistemi Zaten Kapalı!',
              description: `**•** Yardıma ihtiyacın varsa \`/bağlantı-engel Bilgi\` yazabilirsin.`
            }
          ]
        });

      //db.delete(`guilds.${interaction.guild.id}.linkBlock`)
      data.guild.linkBlock.channels = [];
      data.guild.linkBlock.guild = null;
      data.guild.markModified('linkBlock');
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