module.exports = {
  interaction: {
    name: "ban",
    description: "Belirttiğiniz kullanıcıyı yasaklarsınız.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: true
      },
      {
        name: "sebep",
        description: "Belirttiğin kullanıcının yasaklanma sebebini gir.",
        type: 3,
        required: false
      },
      {
        name: "dm-mesaj",
        description: "Yasaklanan kullanıcıya DM üzerinden yasaklanmasını bildir.",
        choices: [
          { name: "Gönder (Varsayılan)", value: "true" },
          { name: "Gönderme", value: "false" }
        ],
        type: 3,
        type: 3,
        required: false
      }
    ]
  },
  aliases: ["yasakla"],
  category: "Moderation",
  memberPermissions: ["BanMembers"],
  botPermissions: ["SendMessages", "EmbedLinks", "BanMembers"],
  cooldown: 5000,

  async execute(client, interaction, data, args) {

    //No args
    if (interaction.type !== 2 && !args[0]) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Üye ve Sebep Belirtmelisin!',
            description: `**•** \`/ban @Rauqq Keyfimin kahyası öyle istedi.\``
          }
        ]
      });
    }

    //User
    const toBanUser = interaction.type === 2
      ? interaction.options.getUser("kullanıcı")
      : interaction.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.tag === args[0]) || await client.users.fetch(args[0]).catch(e => { });

    //Reason
    const reason = interaction.type === 2 ? interaction.options.getString("sebep") : args.slice(1).join(' ');

    //DM Mesaj
    const dmMesaj = (interaction.type === 2 ? (interaction.options.getString("dm-mesaj") || "true") : "true") === "true";

    //Üye bulunamadı!
    if (!toBanUser) {
      return interaction.reply({
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
                value: `**•** \`/ban @Rauqq\``,
              },
              {
                name: `**»** Sunucuda Bulunan/Bulunmayan Üye ID'si`,
                value: `**•** \`/ban 700385307077509180\``,
              },
              /*{
                name: `**»** Sunucuda Bulunan/Bulunmayan Üye Kullanıcı Adı`,
                value: `**•** \`${data.prefix}yasakla ${client.users.cache.get(client.settings.owner).tag}\``,
              },*/
            ]
          }
        ]
      });
    }

    //Kendini yasaklayamazsın!
    if (toBanUser.id === (interaction.type === 2 ? interaction.user : interaction.author).id) {
      return interaction.reply({
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
    if (toBanUser.id === client.user.id) {
      return interaction.reply({
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
    if ((interaction.guild.bans.cache.size ? interaction.guild.bans.cache : await interaction.guild.bans.fetch()).get(toBanUser.id)) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            author: {
              name: `${toBanUser.tag} kullanıcısı zaten yasaklı!`,
              icon_url: toBanUser.displayAvatarURL(),
            },
          }
        ]
      });
    }

    let toBanMember = interaction.guild.members.cache.get(toBanUser.id);
    if (toBanMember) {

      //Üye, o kullanıcıyı yasaklayabilir mi?
      if (toBanMember.roles.highest.rawPosition >= interaction.member.roles.highest.rawPosition)
        return interaction.reply({
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
        return interaction.reply({
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

    const { buttonConfirmation } = require("../../modules/Functions");
    const buttonConfirmationResult = await buttonConfirmation(
      interaction,
      [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${toBanUser.username} kullanıcısını sunucudan yasaklamak istiyor musun?`,
            icon_url: toBanUser.displayAvatarURL(),
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
              name: `${toBanUser.username} kullanıcısının yasaklama işlemi iptal edildi.`,
              icon_url: toBanUser.displayAvatarURL(),
            },
          }
        ],
        components: []
      };

      if (interaction.type === 2)
        return interaction.editReply(messageContent).catch(error => { });
      else return buttonConfirmationResult.reply?.edit(messageContent).catch(error => { });
    }

    let dmMesaj_status = dmMesaj && await toBanUser.send({
      embeds: [{
        color: client.settings.embedColors.red,
        author: {
          name: `${interaction.guild.name}, Sunucusundan Yasaklandın!`,
          icon_url: interaction.guild.iconURL(),
        },
        fields: [
          {
            name: `**»** Yasaklanma Sebebi`,
            value: `**•** ${reason || "Belirtilmemiş."}`,
            inline: false
          }
        ],
        timestamp: new Date(),
        footer: {
          text: `${(interaction.type === 2 ? interaction.user : interaction.author).username} tarafından yasaklandın.`,
          icon_url: (interaction.type === 2 ? interaction.user : interaction.author).displayAvatarURL(),
        },
      }]
    }).catch(error => { });

    //Ban
    await interaction.guild.members.ban(toBanUser, {
      reason: `${reason ? `${reason} • ` : ""}${interaction.type === 2 ? `${interaction.user.tag} (ID: ${interaction.user.id})` : `${interaction.author.tag} (ID: ${interaction.author.id})`} tarafından yasaklandı.`
    }).catch(err => {
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
            name: '» Bir üye yasaklandı!',
            icon_url: client.settings.icon,
          },
          description:
            `**•** **Yasaklanan Üye:** ${toBanUser} (**${toBanUser.id}**)\n` +
            `**•** **Sebep:** ${reason || "Belirtilmemiş."}\n` +
            //`**•** **Yetkili:** ${interaction.type === 2 ? interaction.user : interaction.author}`,
            `**•** DM'den bilgilendirme mesajı **${dmMesaj ? (dmMesaj_status ? "gönderildi" : "gönderilemedi") : "gönderilmedi"}.**`,
          thumbnail: {
            url: toBanUser.displayAvatarURL(),
          },
          timestamp: new Date(),
          footer: {
            text: `${(interaction.type === 2 ? interaction.user : interaction.author).username} tarafından yasaklandı.`,
            icon_url: (interaction.type === 2 ? interaction.user : interaction.author).displayAvatarURL(),
          },
        }
      ],
      components: []
    };

    if (interaction.type === 2)
      await interaction.editReply(messageContent).catch(error => { });
    else await buttonConfirmationResult.reply?.edit(messageContent).catch(error => { });

    //User Statistic
    data.user.statistics.bannedUsers += 1;
    await data.user.save();

  }
};