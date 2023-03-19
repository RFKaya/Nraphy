const songlyrics = require('songlyrics').default;

module.exports = {
  interaction: {
    name: "şarkı-sözleri",
    description: "İsmini girdiğiniz şarkının sözlerini verir.",
    options: [
      {
        name: "şarkı",
        description: "Bir şarkı adı gir.",
        type: 3,
        required: true
      },
    ]
  },
  aliases: ['şarkısözleri', 'lyrics', "sözler", "lyric"],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    const music = interaction.options?.getString("şarkı") || args.join(" ");

    if (music.length < 1) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        title: "**»** Bir Şarkı İsmi Belirtmelisin!",
        description: `**•** Örnek kullanım: \`/şarkı-sözleri Sing Me to Sleep\``
      }]
    });

    if (interaction.type == 2) await interaction.deferReply();

    try {

      let song = await songlyrics(music);

      if (!song) {
        let message = {
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Şarkı Sözleri Bulunamadı!',
              description: `**•** Farklı bir başlık girmeyi deneyebilir misin?`
            }
          ]
        };

        if (interaction.type == 2)
          return interaction.editReply(message);
        else return interaction.reply(message);
      }

      let message = {
        embeds: [
          {
            color: client.settings.embedColors.default,
            //title: `**»** ${firstSong.title}`,
            title: `**»** ${song.title} (${song.source.name})`,
            url: song.source.link,
            author: {
              name: `${client.user.username} • Şarkı Sözleri (Lyrics)`,
              icon_url: client.settings.icon,
            },
            description: song.lyrics,
            /*thumbnail: {
              url: firstSong.thumbnail,
            },*/
            /*timestamp: new Date(),
            footer: {
              text: `Sanatçı: ${firstSong.artist.name}`,
              icon_url: firstSong.artist.thumbnail,
            },*/
          }
        ]
      };

      if (interaction.type == 2)
        return interaction.editReply(message);
      else return interaction.reply(message);

    } catch (error) {

      let message = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Şarkı Sözleri Bulunamadı!',
            description: `**•** Farklı bir başlık girmeyi deneyebilir misin?`
          }
        ]
      };

      if (interaction.type == 2)
        return interaction.editReply(message);
      else return interaction.reply(message);

    }

  }
};