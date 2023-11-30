const { lyricsExtractor } = require('@discord-player/extractor');
const lyricsFinder = lyricsExtractor();

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
  cooldown: 3000,

  async execute(client, interaction, data, args) {

    const music = interaction.options?.getString("şarkı") || args.join(" ");

    if (music.length < 1)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: "**»** Bir Şarkı İsmi Belirtmelisin!",
          description: `**•** Örnek kullanım: \`/şarkı-sözleri Sing Me to Sleep\``
        }]
      });

    if (interaction.type == 2) await interaction.deferReply();

    const lyrics = await lyricsFinder.search(music).catch(() => null);

    if (!lyrics) {
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

    const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

    let message = {
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: `**»** ${lyrics.title}`,
          url: lyrics.url,
          author: {
            name: `${client.user.username} • Şarkı Sözleri (Lyrics)`,
            icon_url: client.settings.icon,
          },
          description: trimmedLyrics,
          thumbnail: {
            url: lyrics.thumbnail
          },
        }
      ]
    };

    if (interaction.type == 2)
      return interaction.editReply(message);
    else return interaction.reply(message);

  }
};