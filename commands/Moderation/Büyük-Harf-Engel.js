const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "büyük-harf-engel",
    description: "Sunucunuzdaki üyelerin büyük harfli mesaj yazmasını engeller.",
    options: [
      {
        name: "bilgi",
        description: "Büyük harf engelleme sistemi hakkında tüm bilgileri sağlar.",
        type: 1,
        options: []
      },
      {
        name: "ayarla",
        description: "Büyük harf engelleme sistemininin nerede çalışacağını ayarlar.",
        type: 2,
        options: [
          {
            name: "sunucu",
            description: "Büyük harf engel sistemini sunucu genelinde çalışacak şekilde ayarlar.",
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
            description: "Büyük harf engelleme sisteminin çalışacağı kanalları seçmenize yarar.",
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
        name: "ayarlar",
        description: "Büyük harf engelleme sistemininin ayarlarını değiştirir.",
        type: 2,
        options: [
          {
            name: "oran",
            description: "Mesajın yüzde kaçı büyük harf ise koruma devreye girsin?",
            type: 1,
            options: [
              {
                name: "oran",
                description: "1-100 arası bir yüzde gir.",
                type: 4,
                required: true
              },
            ]
          },
        ]
      },
      {
        name: "muaf",
        description: "Büyük harf engel sistemine seçtiğiniz rolü/kanalı muaf tutar.",
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
        ]
      },
      {
        name: "kapat",
        description: "Büyük harf engelleme sistemini kapatır yani sıfırlar.",
        type: 1,
        options: []
      }
    ],
  },
  interactionOnly: true,
  aliases: [],
  category: "Moderation",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageMessages"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const getSubcommand = interaction.options.getSubcommandGroup(false);
    const getCommand = interaction.options.getSubcommand();
    const upperCaseBlock = data.guild.upperCaseBlock;

    if (getCommand == "bilgi") {

      const destekSunucusuButon = new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link');

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Büyük Harf Engel (Caps Lock Engel) Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Büyük Harf Engelleme Sistemi Nedir?',
                value: `**•** Büyük harf engelleme sistemi için bir oran belirlediğinizde; sunucunuzdaki üyeler seçtiğiniz kanallarda belirlenen oranın üstünde büyük harfli mesaj yazarsa mesajı silinir.`,
              },
              {
                name: '**»** Sunucu Geneli ya da Belirli Kanallar Nedir?',
                value: `**•** Büyük harf engelleme sistemini sunucudaki tüm kanallar için veya sadece seçtiğiniz kanallar için çalışacak şekilde ayarlayabilirsiniz.`,
              },
              {
                name: '**»** Büyük Harf Engelleme Sistemi Nasıl Açılır?',
                value:
                  `**•** Sunucu geneli için: \`/büyük-harf-engel Ayarla Sunucu Aç\`\n` +
                  `**•** Belirli kanallar için: \`/büyük-harf-engel Ayarla Kanal <#Kanal>\``,
              },
              {
                name: '**»** Muaf Kanallar ve Muaf Roller Nasıl Ayarlanır?',
                value: `**•** \`/büyük-harf-engel Muaf Kanal <#Kanal>\`\n**•** \`/büyük-harf-engel Muaf Rol <@Rol>\``
              },
              {
                name: '**»** Ayarladığım Büyük Harf Engelleme Ayarlarını Nasıl Görürüm?',
                value: `**•** \`/ayarlar\` yazıp alttaki butonlardan **Büyük Harf Engel**'e tıklayarak her detayı görebilirsiniz.`,
              },
              {
                name: '**»** Büyük Harf Engelleme Sistemi Nasıl Kapatılır?',
                value: `**•** \`/büyük-harf-engel Kapat\``,
              },
              {
                name: '**»** Sunucu Genelinde Geçerli Korumayı Belirli Kanallarda Çalışacak Şekile Taşıma',
                value: `**•** \`/büyük-harf-engel Ayarla Sunucu Kapat\` yazarak bunu yapabilirsiniz. Böylece muaf ayarlarınız korunur.`,
              },
              {
                name: '**»** Büyük Harf Oranı Nedir?',
                value: `**•** Varsayılan olarak **%70**'tir ancak isterseniz \`/büyük-harf-engel Ayarlar Oran\` yazarak değiştirebilirsiniz.`
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

    } else if (getSubcommand == "ayarla") {

      if (getCommand == "sunucu") {

        const getOperation = interaction.options.getString("işlem");

        if (getOperation == "ac") {

          if (upperCaseBlock?.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Büyük Harf Engelleme Sistemi Zaten Sunucu Genelinde Açık!',
                  description: `**•** Kapatmak için \`/büyük-harf-engel Kapat\` yazabilirsin.`
                }
              ]
            });

          //db.set(`guilds.${interaction.guild.id}.upperCaseBlock.guild`, true)
          data.guild.upperCaseBlock.guild = true;
          data.guild.markModified('upperCaseBlock.guild');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: '**»** Büyük Harf Engelleme Sistemi Açıldı!',
                description: `**•** Muaflar ve diğer bilgiler için \`/büyük-harf-engel Bilgi\` yazabilirsin.`
              }
            ]
          });

        } else if (getOperation == "kapat") {

          if (!upperCaseBlock)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Büyük Harf Engelleme Sistemi Zaten Kapalı!!',
                  description: `**•** Detaylı bilgi almak için \`/büyük-harf-engel Bilgi\` yazabilirsin.`
                }
              ]
            });

          if (!upperCaseBlock.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Büyük Harf Engelleme Sistemi Zaten Belirli Kanallarda Açık!',
                  description: `**•** Detaylı bilgi almak için \`/büyük-harf-engel Bilgi\` yazabilirsin.`
                }
              ]
            });

          //db.set(`guilds.${interaction.guild.id}.upperCaseBlock.guild`, false)
          data.guild.upperCaseBlock.guild = false;
          data.guild.markModified('upperCaseBlock.guild');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: '**»** Büyük Harf Engelleme Sistemi Sunucu Genelinde Kapatıldı!',
                description: `**•** Sistemle ilgili bilgi almak için \`/büyük-harf-engel Bilgi\` yazabilirsin.`
              }
            ]
          });

        }

        //------------------------------Ayarla - Kanal------------------------------//
      } else if (getCommand == "kanal") {

        const getOperation = interaction.options.getString("işlem");
        const getChannel = interaction.options.getChannel("kanal");

        if (getChannel.type !== 0)
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

          if (upperCaseBlock?.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Büyük Harf Engelleme Sistemi Zaten Sunucu Genelinde Açık!`,
                  description: `**•** Belirttiğin kanal da otomatik olarak koruma dahilinde oluyor.`,
                }
              ],
              ephemeral: true
            });

          if (upperCaseBlock?.channels?.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Belirttiğin Kanal Zaten BüyüK Harf Koruması Altında!`,
                  description: `**•** Detaylı bilgi almak için \`/büyük-harf-engel Bilgi\` yazabilirsin.`,
                }
              ],
              ephemeral: true
            });

          data.guild.upperCaseBlock.channels.push(getChannel.id);
          data.guild.markModified('upperCaseBlock.channels');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** Belirttiğin Kanal Artık Koruma Altında!`,
                description: `**•** Yardıma ihtiyacın olursa \`/büyük-harf-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        } else if (getOperation == "kaldir") {

          if (upperCaseBlock?.guild)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Sanırsam Muaf Demek İstedin Çünkü Şu An Tüm Sunucu Koruma Altında!`,
                  description: `**•** Muaf listesine eklemek/kaldırmak istiyosan /büyük-harf-engel Muaf Kanal Ekle <#kanal>`,
                }
              ],
              ephemeral: true
            });

          if (!upperCaseBlock?.channels || upperCaseBlock.channels.length == 0)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Hiçbir Kanal Koruma Altında Değil ki!`,
                  description: `**•** Olayı yanlış anladın bence sen \`/büyük-harf-engel Bilgi\``,
                }
              ],
              ephemeral: true
            });

          if (!upperCaseBlock.channels.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Anlamadım Seni. Bu Kanal Zaten Koruma Altında Değil Ki!`,
                  description: `**•** Yardım lazımsa \`/büyük-harf-engel Bilgi\` yaz, ben yetişirim sana.`,
                }
              ],
              ephemeral: true
            });

          if (upperCaseBlock.channels.length == 1)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Koruma Listesindeki Kalan Son Kanalı Listeden Çıkaramazsın!`,
                  description: `**•** Önce başka kanal ekle veya direkt sistemi kapat. \`/büyük-harf-engel Kapat\``,
                }
              ],
              ephemeral: true
            });

          upperCaseBlock.channels.splice(upperCaseBlock.channels.indexOf(getChannel.id), 1);

          data.guild.upperCaseBlock.channels = upperCaseBlock.channels;
          data.guild.markModified('upperCaseBlock.channels');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`#${getChannel.name}\` Başarıyla Koruma Listesinden Kaldırıldı!`,
                description: `**•** Yardıma ihtiyacın olursa \`/büyük-harf-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        }

      }

      //------------------------------Ayarlar------------------------------//
    } else if (getSubcommand == "ayarlar") {

      if (getCommand == "oran") {

        const rate = interaction.options.getInteger("oran");

        if (!rate || isNaN(rate) || rate === 'Infinity')
          return interaction.reply({
            embeds: [{
              color: client.settings.embedColors.red,
              title: "**»** **0** ve **100** Arasında Bir Sayı Girmelisin!",
              description: `**•** Sadece sayı girmelisin. Yüzde işaretini girmene gerek yok.`
            }]
          });

        if (Math.round(parseInt(rate)) < 0 || Math.round(parseInt(rate)) > 100)
          return interaction.reply({
            embeds: [{
              color: client.settings.embedColors.red,
              title: "**»** Girdiğin Sayı **0**'den Az veya **100**'den Çok Olamaz!",
              description: `**•** **%0** = **ekşi sözlük** oluyor ama neyse :joy:`
            }]
          });

        data.guild.upperCaseBlock.rate = rate;
        data.guild.markModified('upperCaseBlock.rate');
        await data.guild.save();

        interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: `**»** Büyük Harf Oranı **%${rate}** Olarak Ayarlandı!`,
              description: `**•** Artık mesajlar **%${rate}** oranında büyük harf içeriyorsa mesaj silinecek.`,
            }
          ]
        });

      }

      //------------------------------Muaf------------------------------//
    } else if (getSubcommand == "muaf") {

      const getOperation = interaction.options.getString("işlem");

      if (getCommand == "kanal") {

        const getChannel = interaction.options.getChannel("kanal");

        if (getOperation == "ekle") {

          if (upperCaseBlock && !upperCaseBlock.guild)
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

          if (upperCaseBlock?.exempts?.channels?.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Belirttiğin Kanal Zaten Muaf Listesinde Mevcut!`,
                  description: `**•** Yardıma ihtiyacın olursa \`/büyük-harf-engel Bilgi\` yazabilirsin.`,
                }
              ],
              ephemeral: true
            });

          //db.push(`guilds.${interaction.guild.id}.upperCaseBlock.exempts.channels`, getChannel.id)
          data.guild.upperCaseBlock.exempts.channels.push(getChannel.id);
          data.guild.markModified('upperCaseBlock.exempts.channels');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`#${getChannel.name}\` Başarıyla Muaf Listesine Eklendi!`,
                description: `**•** Yardıma ihtiyacın olursa \`/büyük-harf-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        } else if (getOperation == "kaldir") {

          if (!upperCaseBlock?.exempts?.channels || upperCaseBlock.exempts.channels.length == 0)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Muaf Listesinde Bir Kanal Bile Yok Ki!`,
                  description: `**•** Olayı yanlış anladın bence sen \`/büyük-harf-engel Bilgi\``,
                }
              ],
              ephemeral: true
            });

          if (!upperCaseBlock.exempts.channels.includes(getChannel.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Anlamadım Seni. Bu Kanal Zaten Muaf Listesinde Değil Ki!`,
                  description: `**•** Yardım lazımsa \`/büyük-harf-engel Bilgi\` yaz, ben yetişirim sana.`,
                }
              ],
              ephemeral: true
            });

          upperCaseBlock.exempts.channels.splice(upperCaseBlock.exempts.channels.indexOf(getChannel.id), 1);

          //db.set(`guilds.${interaction.guild.id}.upperCaseBlock.exempts.channels`, upperCaseBlock.exempts.channels)
          data.guild.upperCaseBlock.exempts.channels = upperCaseBlock.exempts.channels;
          data.guild.markModified('upperCaseBlock.exempts.channels');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`#${getChannel.name}\` Başarıyla Muaf Listesinden Kaldırıldı!`,
                description: `**•** Yardıma ihtiyacın olursa \`/büyük-harf-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        }

      } else if (getCommand == "rol") {

        const getRole = interaction.options.getRole("rol");

        if (getOperation == "ekle") {

          if (upperCaseBlock?.exempts?.roles?.includes(getRole.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Belirttiğin Rol Zaten Muaf Listesinde Mevcut!`,
                  description: `**•** Yardıma ihtiyacın olursa \`/büyük-harf-engel Bilgi\` yazabilirsin.`,
                }
              ],
              ephemeral: true
            });

          //db.push(`guilds.${interaction.guild.id}.upperCaseBlock.exempts.roles`, getRole.id)
          data.guild.upperCaseBlock.exempts.roles.push(getRole.id);
          data.guild.markModified('upperCaseBlock.exempts.roles');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`@${getRole.name}\` Başarıyla Muaf Listesine Eklendi!`,
                description: `**•** Yardıma ihtiyacın olursa \`/büyük-harf-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        } else if (getOperation == "kaldir") {

          if (!upperCaseBlock?.exempts?.roles || upperCaseBlock.exempts.roles.length == 0)
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Muaf Listesinde Bir Rol Bile Yok Ki!`,
                  description: `**•** Olayı yanlış anladın bence sen \`/büyük-harf-engel Bilgi\``,
                }
              ],
              ephemeral: true
            });

          if (!upperCaseBlock.exempts.roles.includes(getRole.id))
            return interaction.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: `**»** Anlamadım Seni. Bu Rol Zaten Muaf Listesinde Değil Ki!`,
                  description: `**•** Yardım lazımsa \`/büyük-harf-engel Bilgi\` yaz, ben yetişirim sana.`,
                }
              ],
              ephemeral: true
            });

          upperCaseBlock.exempts.roles.splice(upperCaseBlock.exempts.roles.indexOf(getRole.id), 1);

          //db.set(`guilds.${interaction.guild.id}.upperCaseBlock.exempts.roles`, upperCaseBlock.exempts.roles)
          data.guild.upperCaseBlock.exempts.roles = upperCaseBlock.exempts.roles;
          data.guild.markModified('upperCaseBlock.exempts.roles');
          await data.guild.save();
          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: `**»** \`@${getRole.name}\` Başarıyla Muaf Listesinden Kaldırıldı!`,
                description: `**•** Yardıma ihtiyacın olursa \`/büyük-harf-engel Bilgi\` yazabilirsin.`,
              }
            ]
          });

        }

      }

      //------------------------------Kapat------------------------------//
    } else if (getCommand == "kapat") {

      if (!upperCaseBlock.guild && !upperCaseBlock.channels?.length)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Büyük Harf Engelleme Sistemi Zaten Kapalı!',
              description: `**•** Yardıma ihtiyacın varsa \`/büyük-harf-engel Bilgi\` yazabilirsin.`
            }
          ]
        });

      //db.delete(`guilds.${interaction.guild.id}.upperCaseBlock`)
      data.guild.upperCaseBlock.channels = [];
      data.guild.upperCaseBlock.guild = null;
      data.guild.markModified('upperCaseBlock');
      await data.guild.save();
      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Büyük Harf Engelleme Sistemi Kapatıldı!',
            description: `**•** Artık sunucudaki üyeler büyük harfli mesajlar gönderebilir.`
          }
        ]
      });

    }

  }
};