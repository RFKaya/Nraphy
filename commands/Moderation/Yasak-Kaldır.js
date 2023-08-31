module.exports = {
  interaction: {
    name: "yasak-kaldır",
    description: "Belirttiğiniz kişinin yasağını kaldırır.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: true
      },
    ]
  },
  aliases: ["unban", "un-ban", "yasakkaldır", "yasağı-kaldır", "yasağıkaldır"],
  category: "Moderation",
  memberPermissions: ["BanMembers"],
  botPermissions: ["SendMessages", "EmbedLinks", "BanMembers"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    // No args
    if (interaction.type !== 2 && !args[0]) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yasağının Kaldırılmasını İstediğin Üyeyi Belirtmelisin!',
            description: `**•** Örnek kullanım: \`/yasak-kaldır <ID>\``
          }
        ]
      });
    }

    //Harfli ID
    if (interaction.type !== 2 && !args[0]) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yasağını Kaldıracağın Üyeyi ID İle Belirtlmelisin!',
            description: `**•** Örnek kullanım: \`/yasak-kaldır 700959962452459550\``
          }
        ]
      });
    }

    const user = interaction.type == 2
      ? interaction.options.getUser("kullanıcı")
      : client.users.cache.get(args[0]);

    if (!user)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yasağını Kaldırmak İstediğin Üyeyi Bulamadım!',
            description: interaction.type == 2
              ? `**•** Hatalı bir kullanıcı belirttin. Lütfen sadece ID girerek dene.`
              : `**•** Bu komutu \`/yasak-kaldır\` (Slash) şeklinde kullanarak tekrar dene.`
          }
        ]
      });

    const userBan = await interaction.guild.bans.fetch(user.id).catch(() => { });

    //Zaten yasaklı değil.
    //const guildBans = await interaction.guild.bans.fetch();
    //if (!guildBans.get(user.id))
    if (!userBan)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            //title: '**»** Yasağını Kaldırmak İstediğin Kullanıcıyı Bulamadım!',
            description: `**»** Belirttiğin kullanıcı zaten yasaklı değil.`
          }
        ]
      });

    const { buttonConfirmation } = require("../../modules/Functions");
    const buttonConfirmationResult = await buttonConfirmation(
      interaction,
      [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${user.tag} kullanıcısının yasağını kaldırmak istiyor musun?`,
            icon_url: user.displayAvatarURL(),
          },
        }
      ]
    );

    if (interaction.type === 2 ? !buttonConfirmationResult : !buttonConfirmationResult.status) {
      let messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yasak Kaldırma İşlemini İptal Ettim!',
            description: `**•** Madem iptal edecektin, neden uğraştırıyorsun beni?`
          }
        ],
        components: []
      };

      if (interaction.type === 2)
        return interaction.editReply(messageContent).catch(() => { });
      else return buttonConfirmationResult.reply?.edit(messageContent).catch(() => { });
    }

    await interaction.guild.members.unban(user.id)
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
          return interaction.editReply(messageContent).catch(() => { });
        else return buttonConfirmationResult.reply?.edit(messageContent).catch(() => { });
      });

    //Reply Message
    let messageContent = {
      embeds: [
        {
          color: client.settings.embedColors.green,
          author: {
            name: `${user.tag} kullanıcısının yasağı kaldırıldı!`,
            icon_url: user.displayAvatarURL(),
          },
          //title: '**»** Rauqq#3916 kullanıcısının yasağı kaldırıldı!',
          fields: [
            {
              name: '**»** Yasaklanma Sebebi',
              value: `**•** ${userBan.reason ? client.functions.truncate(userBan.reason, 1000) : "Sebep belirtilmemiş."}`,
            },
          ],
          timestamp: new Date(),
          footer: {
            text: `${interaction.type == 2 ? interaction.user.username : interaction.author.username} tarafından kaldırıldı.`,
            icon_url: interaction.type == 2 ? interaction.user.displayAvatarURL() : interaction.author.displayAvatarURL(),
          },
        }
      ],
      components: []
    };

    if (interaction.type === 2)
      await interaction.editReply(messageContent).catch(() => { });
    else await buttonConfirmationResult.reply?.edit(messageContent).catch(() => { });

  }
};