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
      {
        name: "kaynak",
        description: "Profil resminin hangi kaynaktan alınacağını seç.",
        choices: [
          { name: "Kullanıcı (Varsayılan)", value: "user" },
          { name: "Sunucu", value: "guild" }
        ],
        type: 3,
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

    const user = interaction.type == 2
      ? interaction.options.getUser("kullanıcı") || interaction.user
      : interaction.mentions.users.first() || client.users.cache.get(args.join(" ")) || interaction.author;

    const avatarSource = interaction.type == 2
      ? interaction.options.getString("kaynak") || "user"
      : "user";
    const member = avatarSource === "guild" && interaction.guild.members.cache.get(user.id);

    if (avatarSource === "guild" && !member)
      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Seçtiğin Kullanıcı Sunucuda Yok!',
            description: `**•** Sunucuda olmayan birinin sunucu avatarını nasıl vereyim?`
          }
        ]
      });

    if (avatarSource === "guild" && !member.avatar)
      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Kullanıcının Sunucu Avatarı Yok!',
            description: `**•** Yapacak bir şey yok. Koysaymış :smirk:`
          }
        ]
      });

    return await interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${client.user.username} • Profil Resmi`,
            icon_url: client.settings.icon,
          },
          title: `**»** ${user.username} Kullanıcısının Profil Resmi`,
          fields: [
            {
              name: "Farklı Uzantılarla",
              value: `[png](${(avatarSource === "user" ? user : member).displayAvatarURL({ extension: "png", forceStatic: true, size: 1024, })}) • [jpg](${(avatarSource === "user" ? user : member).displayAvatarURL({ extension: "jpg", forceStatic: true, size: 1024, })}) • [webp](${(avatarSource === "user" ? user : member).displayAvatarURL({ extension: "webp", forceStatic: true, size: 1024 })})`,
            },
          ],
          image: {
            url: (avatarSource === "user" ? user : member).displayAvatarURL({ size: 1024 }),
          },
        }
      ]
    });

  }
};