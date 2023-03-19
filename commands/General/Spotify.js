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
  cooldown: 4000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    if (interaction.type == 2) {
      var member = interaction.guild.members.cache.get(interaction.options.getUser("kullanıcı")?.id) || interaction.member;
    } else {
      var member = interaction.mentions.members.first() || interaction.guild.members.cache.get(args[0]) || interaction.member;
    }

    let Activity = member.presence.activities;
    var SpotifyActivity;
    Activity.forEach(Activity => {
      if (Activity.name == "Spotify" && Activity.type == 2) SpotifyActivity = Activity;
    });

    if (member.presence.activities.length === 0 || !SpotifyActivity) {
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

    member.presence.activities.forEach(activity => {
      if (activity.type === 2 && activity.name === "Spotify") {

        let image = `https://i.scdn.co/image/${activity.assets.largeImage.slice(
          8
        )}`;

        /*let trackIMG = `https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`;
        let trackURL = `https://open.spotify.com/track/${activity.syncID}`;

        let trackName = activity.details;
        let trackAuthor = activity.state;
        let trackAlbum = activity.assets.largeText;

        trackAuthor = trackAuthor.replace(/;/g, ",");*/

        const card = new canvacord.Spotify()
          .setAuthor(activity.state)
          .setAlbum(activity.assets.largeText)
          .setStartTimestamp(activity.timestamps.start)
          .setEndTimestamp(activity.timestamps.end)
          .setImage(image)
          .setBackground("COLOR", "#06050c")
          .setTitle(activity.details);

        /*let embed = new Discord.EmbedBuilder()
            .setAuthor("Spotify • " + trackName, "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2000px-Spotify_logo_without_text.svg.png")
            .setColor("0xdb954")
            .setTitle(`**»** Şarkının **Spotify** bağlantısı.`)
            .setURL(trackURL)
            .setThumbnail(trackIMG)
            .addField("**»** Şarkının İsmi", "**•** " + `${trackName}`)
            .addField("**»** Şarkının Albümü", "**•** " + `${trackAlbum}`)
            .addField("**»** Şarkının Sanatçısı", "**•** " + `${trackAuthor}`)
            .setFooter(message.author.username + ` tarafından istendi.`, message.author.avatarURL())
            .setTimestamp()*/

        card.build().then(Card => {
          const file = new Discord.AttachmentBuilder(Card, { name: "SpotifyCardCreatedByNraphy.png" });
          const exampleEmbed = {
            color: client.settings.embedColors.default,
            title: `**»** ${activity.details}`,
            url: `https://open.spotify.com/track/${activity.syncId}`,
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



          //new Discord.MessageAttachment(Card, "SpotifyCard.png"));
        });
      }
    });
  }
};