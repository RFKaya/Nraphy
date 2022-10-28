const Discord = require("discord.js");
const canvacord = require("canvacord");

module.exports = {
  name: "spotify",
  description: "Dinlediğiniz şarkının bilgilerini verir.",
  usage: "spotify",
  aliases: ["spo", "spoti", "spotif", "spotify", "spotifi"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "AttachFiles"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, message, args, data) {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    let Activity = member.presence.activities;
    var SpotifyActivity;
    Activity.forEach(Activity => {
      if (Activity.name == "Spotify" && Activity.type == 2) SpotifyActivity = Activity;
    });

    if (member.presence.activities.length === 0 || !SpotifyActivity) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bu Kullanıcı Şu Anda **Spotify** Üzerinden Şarkı Dinlemiyor!',
            description: `**•** Belki de durumunu gizlemiştir. Bilemeyiz...`
          }
        ]
      });
    }

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
            .setFooter(message.author.username + ` tarafından istendi.`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp()*/

        card.build().then(Card => {
          const file = new Discord.AttachmentBuilder(Card, { name: "SpotifyCardCreatedByNraphy.png" });
          const exampleEmbed = {
            color: client.settings.embedColors.default,
            title: `**»** ${activity.details}`,
            url: `https://open.spotify.com/track/${activity.syncId}`,
            author: {
              name: `${member.user.username} kullanıcısının Spotify'da dinlediği şarkı!`,
              icon_url: member.user.displayAvatarURL({ dynamic: true, size: 1024 }),
            },
            image: {
              url: 'attachment://SpotifyCardCreatedByNraphy.png',
            },
          };
          return message.channel.send({ embeds: [exampleEmbed], files: [file] });

          //new Discord.MessageAttachment(Card, "SpotifyCard.png"));
        });
      }
    });
  }
};