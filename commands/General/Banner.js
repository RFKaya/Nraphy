module.exports = {
  interaction: {
    name: "banner",
    description: "Profil banner'ını gösterir.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: false
      },
    ]
  },
  aliases: ["afiş"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    if (interaction.type == 2) {
      var user = interaction.options.getUser("kullanıcı") || interaction.user;

    } else {
      var user =
        interaction.mentions.users.first() ||
        client.users.cache.get(args.join(" ")) ||
        interaction.author;

    }

    const bannerURL = (await user.fetch(true)).bannerURL({ size: 512 });

    if (!bannerURL)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: `**»** Bu kullanıcının bir banner'ı bulunmuyor.`
          }
        ]
      });

    return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${client.user.username} • Banner`,
          icon_url: client.settings.icon,
        },
        title: `**»** ${user.username} Kullanıcısının Banner'ı`,
        image: {
          url: bannerURL,
        },
      }]
    });

  }
};