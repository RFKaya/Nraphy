module.exports = {
  interaction: {
    name: "avatar",
    description: "Profil resmini gösterir.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: false
      },
    ]
  },
  aliases: ["avatarım", "pp", "logo", "icon", "profil-resmi"],
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

    interaction.reply({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${client.user.username} • Profil Resmi`,
          icon_url: client.settings.icon,
        },
        title: `**»** ${user.username} Kullanıcısının Profil Resmi`,
        fields: [
          {
            name: "Farklı Uzantılarla",
            value: `[png](${user.displayAvatarURL({ extension: "png", forceStatic: true, size: 1024, })}) • [jpg](${user.displayAvatarURL({ extension: "jpg", forceStatic: true, size: 1024, })}) • [webp](${user.displayAvatarURL({ extension: "webp", forceStatic: true, size: 1024 })})`,
          },
        ],
        image: {
          url: user.displayAvatarURL({ size: 1024 }),
        },
      }]
    });

  }
};