const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "spam-koruması",
    description: "Sunucunuzdaki üyelerin spam yapmasını engeller.",
    options: [
      {
        name: "bilgi",
        description: "Spam koruması sistemi hakkında tüm bilgileri sağlar.",
        type: 1,
        options: []
      },
      {
        name: "ayarla",
        description: "Spam koruması sistemininin ayarlarını ayarlar.",
        type: 2,
        options: [
          {
            name: "sunucu",
            description: "Spam koruması sistemini sunucu genelinde çalışacak şekilde ayarlar.",
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
            description: "Spam koruması sisteminin çalışacağı kanalları seçmenize yarar.",
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
        description: "Spam koruması sistemine seçtiğiniz rolü/kanalı muaf tutar.",
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
          }
        ]
      },
      {
        name: "kapat",
        description: "Spam koruması sistemini kapatır.",
        type: 1,
        options: []
      }
    ],
  },
  interactionOnly: true,
  aliases: ["spam-engel", "spamengel", "spamkoruma", "spamkoruması", "spam", "flood"],
  category: "Moderation",
  memberPermissions: ["Administrator"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageMessages", "ModerateMembers"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {
    const getSubcommand = interaction.options.getSubcommandGroup(false);
    const getCommand = interaction.options.getSubcommand();
    const spamProtection = data.guild.spamProtection;//db.fetch(`guilds.${interaction.guild.id}.spamProtection`)

    //------------------------------Bilgi------------------------------//
    if (getCommand == "bilgi") {

      const destekSunucusuButon = new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link');

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Spam Koruması Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Spam Koruması Sistemi Nedir?',
                value: `**•** Bir kullanıcı sohbeti kirletebilecek, sunucu akışını bozabilecek kadar çok mesaj atıyorsa spam koruması devreye girer ve kullanıcıyı geçici olarak susturur.`,
              },
              {
                name: '**»** Sunucu Geneli ya da Belirli Kanallar Nedir?',
                value: `**•** Spam koruması sistemini sunucudaki tüm kanallar için veya sadece seçtiğiniz kanallar için çalışacak şekilde ayarlayabilirsiniz.`,
              },
              {
                name: '**»** Spam Koruması Sistemi Nasıl Açılır?',
                value:
                  `**•** Sunucu geneli için: \`/spam-koruması Ayarla Sunucu Aç\`\n` +
                  `**•** Belirli kanallar için: \`/spam-koruması Ayarla Kanal <#Kanal>\``,
              },
              {
                name: '**»** Muaf Kanallar ve Muaf Roller Nasıl Ayarlanır?',
                value: `**•** \`/spam-koruması Muaf Kanal <#Kanal>\`\n**•** \`/spam-koruması Muaf Rol <@Rol>\``
              },
              {
                name: '**»** Ayarladığım Spam Koruması Ayarlarını Nasıl Görürüm?',
                value: `**•** \`/ayarlar\` yazıp alttaki butonlardan **Spam Koruması**'na tıklayarak her detayı görebilirsiniz.`,
              },
              {
                name: '**»** Spam Koruması Sistemi Nasıl Kapatılır?',
                value: `**•** \`/spam-koruması Kapat\``,
              },
              {
                name: '**»** Sunucu Genelinde Geçerli Korumayı Belirli Kanallarda Çalışacak Şekile Taşıma',
                value: `**•** \`/spam-koruması Ayarla Sunucu Kapat\` yazarak bunu yapabilirsiniz. Böylece muaf ayarlarınız korunur.`,
              },
              {
                name: '**»** Geçici Olarak Susturulan Üyeler Ne Kadar Süre Boyunca Konuşamaz?',
                value:
                  `**•** Şimdilik geçici olarak susturulan üyeler 60 saniye boyunca susturulur. Yakın zamanda bunu değiştirebileceğiniz ayarlar gelecektir.`
              },
              {
                name: '**»** Kimler Bu Korumadan Muaf Tutulur?',
                value: `**•** **Mesajları Yönet** yetkisine sahip sunucu yetkilileri, ayarladığınız muaf rollerine sahip üyeler ve Nraphy'nin zaman aşımı veremeyeceği tüm üyeler bu korumadan muaf tutulurlar.`
              },
              {
                name: '**»** Tüm Bunlara Rağmen Ben Anlamadım Arkadaş!',
                value: `**•** Aşağıdaki butondan gel [destek sunucumuza](https://discord.gg/QvaDHvuYVm), yardımcı olalım. Aklına takılan nedir?`
              },
            ],
            image: {
              url: "https://cdn.discordapp.com/attachments/832999292582101062/994221665670135828/unknown.png"
            }
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

          if (spamProtection && spamProtection.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Spam Koruması Sistemi Zaten Sunucu Genelinde Açık!',
                  description: `**•** Kapatmak için \`/spam-koruması Kapat\` yazabilirsin.`
                }
              ]
            });

          data.guild.spamProtection.guild = true;
          data.guild.markModified('spamProtection.guild');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: '**»** Spam Koruması Sistemi Açıldı!',
                description: `**•** Muaflar ve diğer bilgiler için \`/spam-koruması Bilgi\` yazabilirsin.`
              }
            ]
          });

        } else if (getOperation == "kapat") {

          if (!spamProtection)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Spam Koruması Sistemi Zaten Kapalı!!',
                  description: `**•** Detaylı bilgi almak için \`/spam-koruması Bilgi\` yazabilirsin.`
                }
              ]
            });

          if (!spamProtection.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Spam Koruması Sistemi Zaten Belirli Kanallarda Açık!',
                  description: `**•** Detaylı bilgi almak için \`/spam-koruması Bilgi\` yazabilirsin.`
                }
              ]
            });

          data.guild.spamProtection.guild = false;
          data.guild.markModified('spamProtection.guild');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: '**»** Spam Koruması Sistemi Sunucu Genelinde Kapatıldı!',
                description: `**•** Sistemle ilgili bilgi almak için \`/spam-koruması Bilgi\` yazabilirsin.`
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

          if (spamProtection && spamProtection.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Spam Koruması Sistemi Zaten Sunucu Genelinde Açık!`,
                  description: `**•** Belirttiğin kanal da otomatik olarak koruma dahilinde oluyor.`,
                }
              ],
              ephemeral: true
            });

          if (spamProtection && spamProtection.channels && spamProtection.channels.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Belirttiğin Kanal Zaten Bağlantı Koruması Altında!`,
                  description: `**•** Detaylı bilgi almak için \`/spam-koruması Bilgi\` yazabilirsin.`,
                }
              ],
              ephemeral: true
            });

          data.guild.spamProtection.channels.push(getChannel.id);
          data.guild.markModified('spamProtection.channels');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** Belirttiğin Kanal Artık Koruma Altında!`,
                description: `**•** Yardıma ihtiyacın olursa \`/spam-koruması Bilgi\` yazabilirsin.`,
              }
            ]
          });

        } else if (getOperation == "kaldir") {

          if (spamProtection && spamProtection.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Sanırsam Muaf Demek İstedin Çünkü Şu An Tüm Sunucu Koruma Altında!`,
                  description: `**•** Muaf listesine eklemek/kaldırmak istiyosan /spam-koruması Muaf Kanal Ekle <#kanal>`,
                }
              ],
              ephemeral: true
            });

          if (!spamProtection || !spamProtection.channels || spamProtection.channels.length == 0)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Hiçbir Kanal Koruma Altında Değil ki!`,
                  description: `**•** Olayı yanlış anladın bence sen \`/spam-koruması Bilgi\``,
                }
              ],
              ephemeral: true
            });

          if (!spamProtection.channels.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Anlamadım Seni. Bu Kanal Zaten Koruma Altında Değil Ki!`,
                  description: `**•** Yardım lazımsa \`/spam-koruması Bilgi\` yaz, ben yetişirim sana.`,
                }
              ],
              ephemeral: true
            });

          if (spamProtection.channels.length == 1)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Koruma Listesindeki Kalan Son Kanalı Listeden Çıkkaramazsın!`,
                  description: `**•** Önce başka kanal ekle veya direkt sistemi kapat. \`/spam-koruması Bilgi\``,
                }
              ],
              ephemeral: true
            });

          spamProtection.channels.splice(spamProtection.channels.indexOf(getChannel.id), 1);

          data.guild.spamProtection.channels = spamProtection.channels;
          data.guild.markModified('spamProtection.channels');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`#${getChannel.name}\` Başarıyla Koruma Listesinden Kaldırıldı!`,
                description: `**•** Yardıma ihtiyacın olursa \`/spam-koruması Bilgi\` yazabilirsin.`,
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

          if (spamProtection && !spamProtection.guild)
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

          if (spamProtection && spamProtection.exempts && spamProtection.exempts.channels && spamProtection.exempts.channels.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Belirttiğin Kanal Zaten Muaf Listesinde Mevcut!`,
                  description: `**•** Yardıma ihtiyacın olursa \`/spam-koruması Bilgi\` yazabilirsin.`,
                }
              ],
              ephemeral: true
            });

          data.guild.spamProtection.exempts.channels.push(getChannel.id);
          data.guild.markModified('spamProtection.exempts.channels');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`#${getChannel.name}\` Başarıyla Muaf Listesine Eklendi!`,
                description: `**•** Yardıma ihtiyacın olursa \`/spam-koruması Bilgi\` yazabilirsin.`,
              }
            ]
          });

        } else if (getOperation == "kaldir") {

          if (!spamProtection || !spamProtection.exempts || !spamProtection.exempts.channels || spamProtection.exempts.channels.length == 0)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Muaf Listesinde Bir Kanal Bile Yok Ki!`,
                  description: `**•** Olayı yanlış anladın bence sen \`/spam-koruması Bilgi\``,
                }
              ],
              ephemeral: true
            });

          if (!spamProtection.exempts.channels.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Anlamadım Seni. Bu Kanal Zaten Muaf Listesinde Değil Ki!`,
                  description: `**•** Yardım lazımsa \`/spam-koruması Bilgi\` yaz, ben yetişirim sana.`,
                }
              ],
              ephemeral: true
            });

          spamProtection.exempts.channels.splice(spamProtection.exempts.channels.indexOf(getChannel.id), 1);

          data.guild.spamProtection.exempts.channels = spamProtection.exempts.channels;
          data.guild.markModified('spamProtection.exempts.channels');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`#${getChannel.name}\` Başarıyla Muaf Listesinden Kaldırıldı!`,
                description: `**•** Yardıma ihtiyacın olursa \`/spam-koruması Bilgi\` yazabilirsin.`,
              }
            ]
          });

        }

      } else if (getCommand == "rol") {

        const getRole = interaction.options.getRole("rol");

        if (getOperation == "ekle") {

          if (spamProtection && spamProtection.exempts && spamProtection.exempts.roles && spamProtection.exempts.roles.includes(getRole.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Belirttiğin Rol Zaten Muaf Listesinde Mevcut!`,
                  description: `**•** Yardıma ihtiyacın olursa \`/spam-koruması Bilgi\` yazabilirsin.`,
                }
              ],
              ephemeral: true
            });

          data.guild.spamProtection.exempts.roles.push(getRole.id);
          data.guild.markModified('spamProtection.exempts.roles');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`@${getRole.name}\` Başarıyla Muaf Listesine Eklendi!`,
                description: `**•** Yardıma ihtiyacın olursa \`/spam-koruması Bilgi\` yazabilirsin.`,
              }
            ]
          });

        } else if (getOperation == "kaldir") {

          if (!spamProtection || !spamProtection.exempts || !spamProtection.exempts.roles || spamProtection.exempts.roles.length == 0)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Muaf Listesinde Bir Rol Bile Yok Ki!`,
                  description: `**•** Olayı yanlış anladın bence sen \`/spam-koruması Bilgi\``,
                }
              ],
              ephemeral: true
            });

          if (!spamProtection.exempts.roles.includes(getRole.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Anlamadım Seni. Bu Rol Zaten Muaf Listesinde Değil Ki!`,
                  description: `**•** Yardım lazımsa \`/spam-koruması Bilgi\` yaz, ben yetişirim sana.`,
                }
              ],
              ephemeral: true
            });

          spamProtection.exempts.roles.splice(spamProtection.exempts.roles.indexOf(getRole.id), 1);

          data.guild.spamProtection.exempts.roles = spamProtection.exempts.roles;
          data.guild.markModified('spamProtection.exempts.roles');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`@${getRole.name}\` Başarıyla Muaf Listesinden Kaldırıldı!`,
                description: `**•** Yardıma ihtiyacın olursa \`/spam-koruması Bilgi\` yazabilirsin.`,
              }
            ]
          });

        }

      }

      //------------------------------Kapat------------------------------//
    } else if (getCommand == "kapat") {

      if (!spamProtection.guild && !spamProtection.channels.length)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Spam Koruması Sistemi Zaten Kapalı!',
              description: `**•** Yardıma ihtiyacın varsa \`/spam-koruması Bilgi\` yazabilirsin.`
            }
          ]
        });

      data.guild.spamProtection.channels = [];
      data.guild.spamProtection.guild = null;
      data.guild.markModified('spamProtection');
      await data.guild.save();
      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Spam Koruması Sistemi Kapatıldı!',
            description: `**•** Artık sunucudaki üyeler spam yapabilir.`
          }
        ]
      });

    }

  }
};