const { ButtonBuilder } = require('discord.js');

module.exports = {
  name: "yasakla",
  description: "Belirttiğiniz kullanıcıyı yasaklarsınız.",
  usage: "yasakla @Üye <Sebep>",
  aliases: ["ban"],
  category: "Moderation",
  memberPermissions: ["BanMembers"],
  botPermissions: ["SendMessages", "EmbedLinks", "BanMembers"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    // No args
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Üye ve Sebep Belirtmelisin!',
            description: `**•** \`${data.prefix}yasakla @Avalanche Keyfimin kahyası öyle istedi.\``
          }
        ]
      });
    }

    // Reason
    let sebep = args[1] ? args.slice(1).join(' ') : 'Sebep belirtilmemiş.';
    let reason = (sebep + ' • Yasaklayan Yetkili: ' + message.author.tag + ' (' + message.author.id + ')');

    let toBan = await
      message.mentions.users.first() ||               //Etiket
      client.users.cache.get(args[0]) ||              //ID ile genel bulma
      client.users.cache.find(u => u.tag === args[0]); //Tag ile genel bulma
    //message.mentions.users.first() || message.guild.members.cache.get(args[0]) || client.users.resolve(args[0]) || client.users.cache.find(u => u.username === args[0]) || client.users.cache.get(args[0]);

    //Üye bulunamadı!
    if (!toBan) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yasaklamak İstediğin Üyeyi Bulamadım! Belirtebileceğin Üyeler:',
            /*description: 
            `**»** Belirtebileceğin Üye Türleri:\n\n`
            + `**•** Sunucuda bulunan/bulunmayan üye etiketi\n`
            + `**•** Sunucuda bulunan/bulunmayan üye ID'si\n`
            + `**•** Sunucuda bulunan/bulunmayan üye kullanıcı adı`,*/
            //description: `**•** Belirtebileceğin üye türleri:`,
            fields: [
              {
                name: `**»** Sunucuda Bulunan/Bulunmayan Üye Etiketi`,
                value: `**•** \`${data.prefix}yasakla @Rauqq\``,
              },
              {
                name: `**»** Sunucuda Bulunan/Bulunmayan Üye ID'si`,
                value: `**•** \`${data.prefix}yasakla 700385307077509180\``,
              },
              {
                name: `**»** Sunucuda Bulunan/Bulunmayan Üye Kullanıcı Adı`,
                value: `**•** \`${data.prefix}yasakla ${client.users.cache.get(client.settings.owner).tag}\``,
              },
            ]
          }
        ]
      });
    }

    //Kendini yasaklayamazsın!
    if (toBan.id === message.author.id) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Kendini Yasaklayamazsın!',
            description: `**•** Yani neden mesala? Gel anlat, dertleşelim.`
          }
        ]
      });
    }

    //Beni yasaklayamazsın!
    if (toBan.id === client.user.id) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Neden? Neden Ben? :sob:',
            description: `**•** Kırma beni, nolursun... Beni yasaklama. Kıyma bana :broken_heart:`
          }
        ]
      });
    }

    //Zaten yasaklı!
    if (message.guild.bans.cache.get(toBan.id)) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            author: {
              name: `${toBan.tag} kullanıcısı zaten yasaklı!`,
              icon_url: toBan.displayAvatarURL(),
            },
          }
        ]
      });
    }

    if (message.guild.members.cache.get(toBan.id)) {

      let toBanMember = message.guild.members.cache.get(toBan.id);

      //Üye, o kullanıcıyı yasaklayabilir mi?
      if (toBanMember.roles.highest.rawPosition >= message.member.roles.highest.rawPosition)
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bu Kullanıcıyı Yasaklayamazsın!',
              description: `**•** Yasaklamak için ondan daha yüksek bir role sahip olmalısın.`
            }
          ]
        });

      //Bot, o kullanıcıyı yasaklayabilir mi?
      if (!toBanMember.bannable) {
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bu Kullanıcıyı Yasaklayabilecek Yetkim Yok!',
              description: `**•** Bu üyenin üstünde bir rolüm olmalı.`
            }
          ]
        });
      }
    }

    const yasaklog = {
      color: client.settings.embedColors.green,
      author: {
        name: '» Bir üye yasaklandı!',
        icon_url: client.settings.icon,
      },
      description:
        `**•** **Yasaklanan Üye:** ${toBan} (**${toBan.id}**)\n` +
        `**•** **Sebep:** ${sebep}\n` +
        `**•** **Yetkili:** ${message.author}`,
      thumbnail: {
        url: toBan.displayAvatarURL({ size: 1024 }),
      },
      timestamp: new Date(),
      footer: {
        text: `${message.author.username} tarafından yasaklandı.`,
        icon_url: message.author.displayAvatarURL(),
      },
    };

    let confirmButton = new ButtonBuilder().setLabel('Onayla').setCustomId("confirmButton").setStyle('Success');
    let denyButton = new ButtonBuilder().setLabel('İptal Et').setCustomId("denyButton").setStyle('Danger');

    message.channel.send({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${toBan.username} kullanıcısını sunucudan yasaklamak istiyor musun?`,
          icon_url: toBan.displayAvatarURL(),
        },
      }],
      components: [
        {
          type: 1, components: [
            confirmButton, denyButton
          ]
        }
      ]
    }).then(msg => {

      const filter = i => {
        i.deferUpdate();
        return i.user.id === message.author.id;
      };

      msg.awaitMessageComponent({ filter, time: 600000 })
        .then(async btn => {

          if (btn.customId === "confirmButton") {

            msg.edit({
              embeds: [yasaklog],
              components: []
            });

            message.guild.members.ban(toBan, { reason: reason })
              .catch(err => {
                if (err) return msg.edit({
                  embeds: [
                    {
                      color: client.settings.embedColors.red,
                      title: '**»** Bir Hata Oluştu!',
                      description: `**•** Nedenini ben de bilmiyorum ki.`
                    }
                  ],
                  components: []
                });
              });

            var userData = await client.database.fetchUser(message.author.id);
            userData.statistics.bannedUsers += 1;
            await userData.save();

          } else if (btn.customId === "denyButton") {

            msg.edit({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  author: {
                    name: `${toBan.username} kullanıcısının yasaklama işlemi iptal edildi.`,
                    icon_url: toBan.displayAvatarURL(),
                  },
                }
              ],
              components: []
            });

          }
        }).catch(err => {

          return msg.edit({
            embeds: [
              {
                color: client.settings.embedColors.red,
                author: {
                  name: `${toBan.username} kullanıcısının yasaklama işlemi iptal edildi.`,
                  icon_url: toBan.displayAvatarURL(),
                },
              }
            ],
            components: []
          });

        });
    });
  }
};