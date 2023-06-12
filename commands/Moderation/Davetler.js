module.exports = {
  interaction: {
    name: "davetler",
    description: "Kullanıcının davetlerini gösterir.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: false
      },
    ]
  },
  aliases: ['invites'],
  category: "Moderation",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    const user = interaction.type === 2
      ? interaction.options.getUser("kullanıcı") || interaction.user
      : interaction.mentions.users.first() || client.users.cache.get(args.join(" ")) || interaction.author;

    if (!data.guild.inviteManager.invites)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bu Sunucuda Kayıt Edilmiş Hiç Davet Yok!',
            description:
              `**•** Davet sistemi kapalı olabilir.\n` +
              `**•** Davet sistemi açıldığından beri hiç kimse davet edilmemiş olabilir.`
          }
        ]
      });

    if (!data.guild.inviteManager.invites[user.id]?.length)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            author: {
              name: `${user.username} Kullanıcısının Hiç Daveti Bulunmuyor!`,
              icon_url: user.displayAvatarURL(),
            }
          }
        ]
      });

    return interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${user.username} Kullanıcısının Davetleri`,
            icon_url: user.displayAvatarURL(),
          },
          description:
            `**»** Toplam Davet: **${data.guild.inviteManager.invites[user.id].length}**\n` +
            `**•** En Son Davet Ettiği Üye: \`${interaction.guild.members.cache.get(data.guild.inviteManager.invites[user.id].slice(-1)[0])?.user.tag || data.guild.inviteManager.invites[user.id].slice(-1)}\`\n\n` +

            `**•** Davet sıralamasını görmek için \`/sıralama\` yazabilirsin.`
        }
      ]
    });

  }
};