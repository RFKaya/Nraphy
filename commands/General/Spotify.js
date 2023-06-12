const Discord = require("discord.js");
const canvacord = require("canvacord");

module.exports = {
  interaction: {
    name: "spotify",
    description: "Dinlediğiniz şarkının bilgilerini verir..",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: false
      },
    ],
  },
  aliases: ["spo", "spoti", "spotif", "spotify", "spotifi"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "AttachFiles"],
  nsfw: false,
  cooldown: 5000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    var member = interaction.type == 2
      ? interaction.guild.members.cache.get(interaction.options.getUser("kullanıcı")?.id) || interaction.member
      : interaction.mentions.members.first() || interaction.guild.members.cache.get(args[0]) || interaction.member;

    var SpotifyActivity = member.presence.activities.find(activity => activity.name == "Spotify" && activity.type == 2);

    if (!SpotifyActivity) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bu Kullanıcı Şu Anda **Spotify** Üzerinden Şarkı Dinlemiyor!',
            description: `**•** Belki de durumunu gizlemiştir. Bilemeyiz...`
          }
        ]
      });
    }

    if (interaction.type == 2)
      await interaction.deferReply();

    const card = await (new canvacord.Spotify()
      .setAuthor(SpotifyActivity.state)
      .setAlbum(SpotifyActivity.assets.largeText)
      .setStartTimestamp(SpotifyActivity.timestamps.start)
      .setEndTimestamp(SpotifyActivity.timestamps.end)
      .setImage(`https://i.scdn.co/image/${SpotifyActivity.assets.largeImage.slice(8)}`)
      .setBackground("COLOR", "#06050c")
      .setTitle(SpotifyActivity.details)).build();

    const file = new Discord.AttachmentBuilder(card, { name: "SpotifyCardCreatedByNraphy.png" });
    const exampleEmbed = {
      color: client.settings.embedColors.default,
      title: `**»** ${SpotifyActivity.details}`,
      url: `https://open.spotify.com/track/${SpotifyActivity.syncId}`,
      author: {
        name: `${member.user.username} kullanıcısının Spotify'da dinlediği şarkı!`,
        icon_url: member.user.displayAvatarURL(),
      },
      image: {
        url: 'attachment://SpotifyCardCreatedByNraphy.png',
      },
    };

    if (interaction.type == 2)
      return interaction.editReply({ embeds: [exampleEmbed], files: [file] });
    else return interaction.reply({ embeds: [exampleEmbed], files: [file] });

  }
};