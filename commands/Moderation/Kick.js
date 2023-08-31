module.exports = {
  interaction: {
    name: "kick",
    description: "Belirttiğiniz kullanıcıyı sunucudan atarsınız.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: true
      },
      {
        name: "sebep",
        description: "Belirttiğin kullanıcının atılma sebebini gir.",
        type: 3,
        required: false
      },
      {
        name: "dm-mesaj",
        description: "Tekmelenen kullanıcıya DM üzerinden tekmelenmesini bildir.",
        choices: [
          { name: "Gönder (Varsayılan)", value: "true" },
          { name: "Gönderme", value: "false" }
        ],
        type: 3,
        required: false
      }
    ]
  },
  aliases: ["at", 'tekme', 'tekmele'],
  category: "Moderation",
  memberPermissions: ["KickMembers"],
  botPermissions: ["SendMessages", "EmbedLinks", "KickMembers"],
  cooldown: 5000,

  async execute(client, interaction, data, args) {

    //No args
    if (interaction.type !== 2 && !args[0]) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Üye ve Sebep Belirtmelisin!',
            description: `**•** \`/kick @Rauqq Keyfimin kahyası öyle istedi.\``
          }
        ]
      });
    }

    //User
    const toKickMember = interaction.type === 2
      ? interaction.guild.members.cache.get(interaction.options.getUser("kullanıcı").id)
      : interaction.mentions.members.first() || interaction.guild.members.cache.get(args[0]) || interaction.guild.members.cache.find(u => u.user.tag === args[0]);

    //Reason
    const reason = interaction.type === 2 ? interaction.options.getString("sebep") : args.slice(1).join(' ');

    //DM Mesaj
    const dmMesaj = (interaction.type === 2 ? (interaction.options.getString("dm-mesaj") || "true") : "true") === "true";

    //Üye bulunamadı!
    if (!toKickMember) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Tekmelemek İstediğin Üyeyi Sunucuda Bulamadım!',
            /*description: 
            `**»** Belirtebileceğin Üye Türleri:\n\n`
            + `**•** Sunucuda bulunan/bulunmayan üye etiketi\n`
            + `**•** Sunucuda bulunan/bulunmayan üye ID'si\n`
            + `**•** Sunucuda bulunan/bulunmayan üye kullanıcı adı`,*/
            //description: `**•** Belirtebileceğin üye türleri:`,
            fields: [
              {
                name: `**»** Sunucuda Bulunan Üye Etiketi`,
                value: `**•** \`/kick @Rauqq\``,
              },
              {
                name: `**»** Sunucuda Bulunan Üye ID'si`,
                value: `**•** \`/kick 700385307077509180\``,
              },
              /*{
                name: `**»** Sunucuda Bulunan Üye Kullanıcı Adı`,
                value: `**•** \`${data.prefix}kick ${client.users.cache.get(client.settings.owner).tag}\``,
              },*/
            ]
          }
        ]
      });
    }

    //Kendini Tekmeleyemezsin!
    if (toKickMember.id === (interaction.type === 2 ? interaction.user : interaction.author).id) {
      return interaction.reply({
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
    if (toKickMember.id === client.user.id) {
      return interaction.reply({
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
    if (toKickMember.roles.highest.rawPosition >= interaction.member.roles.highest.rawPosition)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bu Kullanıcıyı Tekmeleyemezsin!',
            description: `**•** Tekmelemek için ondan daha yüksek bir role sahip olmalısın.`
          }
        ]
      });

    //Bot, o kullanıcıyı tekmeleyebilir mi?
    if (!toKickMember.kickable) {
      return interaction.reply({
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
      interaction,
      [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${toKickMember.user.username} kullanıcısını sunucudan atmak istiyor musun?`,
            icon_url: toKickMember.displayAvatarURL(),
          },
        }
      ]
    );

    if (interaction.type === 2 ? !buttonConfirmationResult : !buttonConfirmationResult.status) {
      let messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            author: {
              name: `${toKickMember.user.username} kullanıcısının tekmeleme işlemi iptal edildi.`,
              icon_url: toKickMember.displayAvatarURL(),
            },
          }
        ],
        components: []
      };

      if (interaction.type === 2)
        return interaction.editReply(messageContent).catch(error => { });
      else return buttonConfirmationResult.reply?.edit(messageContent).catch(error => { });
    }

    let dmMesaj_status = dmMesaj && await toKickMember.send({
      embeds: [{
        color: client.settings.embedColors.red,
        author: {
          name: `${interaction.guild.name}, Sunucusundan Atıldın!`,
          icon_url: interaction.guild.iconURL(),
        },
        fields: [
          {
            name: `**»** Atılma Sebebi`,
            value: `**•** ${reason ? client.functions.truncate(reason, 1000) : "Belirtilmemiş."}`,
            inline: false
          }
        ],
        timestamp: new Date(),
        footer: {
          text: `${(interaction.type === 2 ? interaction.user : interaction.author).username} tarafından atıldın.`,
          icon_url: (interaction.type === 2 ? interaction.user : interaction.author).displayAvatarURL(),
        },
      }]
    }).catch(error => { });

    //Kick
    await interaction.guild.members.kick(toKickMember)//, { reason: reason })
      .catch(err => {
        client.logger.error(err);

        let messageContent = {
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Nedenini ben de bilmiyorum ki.`
            }
          ],
          components: []
        };

        if (interaction.type === 2)
          return interaction.editReply(messageContent).catch(error => { });
        else return buttonConfirmationResult.reply?.edit(messageContent).catch(error => { });
      });

    //Reply Message
    let messageContent = {
      embeds: [
        {
          color: client.settings.embedColors.green,
          author: {
            name: '» Bir üye tekmelendi!',
            icon_url: client.settings.icon,
          },
          description:
            `**•** **Tekmelenen Üye:** ${toKickMember} (**${toKickMember.id}**)\n` +
            `**•** **Sebep:** ${reason ? client.functions.truncate(reason, 500) : "Belirtilmemiş."}\n` +
            //`**•** **Yetkili:** ${interaction.type === 2 ? interaction.user : interaction.author}`,
            `**•** DM'den bilgilendirme mesajı **${dmMesaj ? (dmMesaj_status ? "gönderildi" : "gönderilemedi") : "gönderilmedi"}.**`,
          thumbnail: {
            url: toKickMember.displayAvatarURL(),
          },
          timestamp: new Date(),
          footer: {
            text: `${(interaction.type === 2 ? interaction.user : interaction.author).username} tarafından tekmelendi.`,
            icon_url: (interaction.type === 2 ? interaction.user : interaction.author).displayAvatarURL(),
          },
        }
      ],
      components: []
    };

    if (interaction.type === 2)
      await interaction.editReply(messageContent).catch(error => { });
    else await buttonConfirmationResult.reply?.edit(messageContent).catch(error => { });

    data.user.statistics.kickedUsers += 1;
    await data.user.save();

  }
};