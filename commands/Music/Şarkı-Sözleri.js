//const GeniusClient = new Genius.Client("yJpD_QqHfysc4xIINm2XkBaLiuj0iAcxAx01qdACFCxPH564MYCMM3pKWNSIQddw");
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
  interactionOnly: false,
  aliases: ['şarkısözleri', 'şarkı', 'lyrics', "sözler", "lyric"],
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

    /*const searches = await GeniusClient.songs.search(music);

    // Pick first one
    const firstSong = searches[0];

    let lyrics;
    // Ok lets get the lyrics
    lyrics = await firstSong.lyrics().catch(err => lyrics = "**•** Şarkı sözleri verisi alınamadı. Lütfen tekrar deneyin.")*/

    let song = await songlyrics(music)
      //.then((lyrics) => console.log(lyrics))
      .catch(error => {
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Şarkı Sözleri Bulunamadı!',
              description: `**•** Farklı bir şarkı girmeyi deneyebilir misin?`
            }
          ]
        });
        //client.logger.error(error)
      });

    interaction.reply({
      embeds: [{
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
      }]
    });

  }
};