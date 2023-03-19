const { ButtonBuilder } = require('discord.js');

module.exports = {
  name: "kick",
  description: "Belirttiğiniz kullanıcıyı sunucudan atarsınız.",
  usage: "kick @Üye <Sebep>",
  aliases: ["at", 'tekme', 'tekmele'],
  category: "Moderation",
  memberPermissions: ["KickMembers"],
  botPermissions: ["SendMessages", "EmbedLinks", "KickMembers"],
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
            description: `**•** \`${data.prefix}kick @Avalanche Keyfimin kahyası öyle istedi.\``
          }
        ]
      });
    }

    // Reason
    let sebep = args[1] ? args.slice(1).join(' ') : 'Sebep belirtilmemiş.';
    let reason = (sebep + ' • Tekmeleyen Yetkili: ' + message.author.tag + ' (' + message.author.id + ')');

    let toKick = await
      message.mentions.members.first() ||                     //Etiket
      message.guild.members.cache.get(args[0]) ||             //ID ile sunucuda bulma
      message.guild.members.cache.find(u => u.user.tag === args[0]);//Tag ile sunucuda bulma
    //message.mentions.users.first() || message.guild.members.cache.get(args[0]) || client.users.resolve(args[0]) || client.users.cache.find(u => u.username === args[0]) || client.users.cache.get(args[0]);

    //Üye bulunamadı!
    if (!toKick) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Tekmelemek İstediğin Üyeyi Bulamadım! Belirtebileceğin Üyeler:',
            /*description: 
            `**»** Belirtebileceğin Üye Türleri:\n\n`
            + `**•** Sunucuda bulunan/bulunmayan üye etiketi\n`
            + `**•** Sunucuda bulunan/bulunmayan üye ID'si\n`
            + `**•** Sunucuda bulunan/bulunmayan üye kullanıcı adı`,*/
            //description: `**•** Belirtebileceğin üye türleri:`,
            fields: [
              {
                name: `**»** Sunucuda Bulunan Üye Etiketi`,
                value: `**•** \`${data.prefix}kick @Rauqq\``,
              },
              {
                name: `**»** Sunucuda Bulunan Üye ID'si`,
                value: `**•** \`${data.prefix}kick 700385307077509180\``,
              },
              {
                name: `**»** Sunucuda Bulunan Üye Kullanıcı Adı`,
                value: `**•** \`${data.prefix}kick ${client.users.cache.get(client.settings.owner).tag}\``,
              },
            ]
          }
        ]
      });
    }

    //Kendini Tekmeleyemezsin!
    if (toKick.id === message.author.id) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Kendini Tekmeleyemezsin!',
            description: `**•** Yani neden mesala? Gel anlat, dertleşelim.`
          }
        ]
      });
    }

    //Beni Tekmeleyemezsin!
    if (toKick.id === client.user.id) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Neden? Neden Ben? :sob:',
            description: `**•** Kırma beni, nolursun... Beni atma. Kıyma bana :broken_heart:`
          }
        ]
      });
    }

    //Üye, o kullanıcıyı tekmeleyebilir mi?
    if (toKick.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bu Kullanıcıyı Tekmeleyemezsin!',
          description: `**•** Tekmelemek için ondan daha yüksek bir role sahip olmalısın.`
        }
      ]
    });

    //Bot, o kullanıcıyı yasaklayabilir mi?
    if (!toKick.kickable) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bu Kullanıcıyı Tekmeleyebilecek Yetkim Yok!',
            description: `**•** Bu üyenin üstünde bir rolüm olmalı.`
          }
        ]
      });
    }

    const { buttonConfirmation } = require("../../modules/Functions");
    const buttonConfirmationResult = await buttonConfirmation(
      message,
      [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${toKick.user.username} kullanıcısını sunucudan atmak istiyor musun?`,
            icon_url: toKick.displayAvatarURL(),
          },
        }
      ]
    );

    if (!buttonConfirmationResult.status)
      return buttonConfirmationResult.reply.edit({
        embeds: [
          {
            color: client.settings.embedColors.red,
            author: {
              name: `${toKick.user.username} kullanıcısının tekmeleme işlemi iptal edildi.`,
              icon_url: toKick.displayAvatarURL(),
            },
          }
        ],
        components: []
      });

    await message.guild.members.kick(toKick)//, { reason: reason })
      .catch(err => {
        client.logger.error(err);
        return buttonConfirmationResult.reply.edit({
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

    await buttonConfirmationResult.reply.edit({
      embeds: [
        {
          color: client.settings.embedColors.green,
          author: {
            name: '» Bir üye tekmelendi!',
            icon_url: client.settings.icon,
          },
          description:
            `**•** **Tekmelenen Üye:** ${toKick} (**${toKick.id}**)\n` +
            `**•** **Sebep:** ${sebep}\n` +
            `**•** **Yetkili:** ${message.author}`,
          thumbnail: {
            url: toKick.displayAvatarURL(),
          },
          timestamp: new Date(),
          footer: {
            text: `${message.author.username} tarafından tekmelendi.`,
            icon_url: message.author.displayAvatarURL(),
          },
        }
      ],
      components: []
    });

    var userData = await client.database.fetchUser(message.author.id);
    userData.statistics.kickedUsers += 1;
    await userData.save();

  }
};