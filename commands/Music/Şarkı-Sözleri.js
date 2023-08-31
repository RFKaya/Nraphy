const fetch = global.fetch || require("node-fetch");
const { parse } = require('node-html-parser');
const getInfo = async query => {
  const info = await fetch(`https://genius.com/api/search/multi?per_page=1&q=${encodeURI(query)}`).then(res => res.json());
  return info.response.sections[0].hits.length ? info : null;
};

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

    if (music.length < 1)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: "**»** Bir Şarkı İsmi Belirtmelisin!",
          description: `**•** Örnek kullanım: \`/şarkı-sözleri Sing Me to Sleep\``
        }]
      });

    if (interaction.type == 2) await interaction.deferReply();

    try {

      const info = await getInfo(music);
      const song = info?.response.sections[0].hits[0].result;

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

      const document = parse(await fetch(url).then(res => res.text()));
      const lyrics = document.querySelectorAll(
        "div[class*='Lyrics__Container']"
      ).map(x => {
        x.innerHTML = x.innerHTML.replaceAll("<br>", "\n");
        return x.text;
      })
        .join("\n")
        .trim();


      let message = {
        embeds: [
          {
            color: client.settings.embedColors.default,
            //title: `**»** ${firstSong.title}`,
            title: `**»** ${song.full_title}`,
            url: song.url,
            author: {
              name: `${client.user.username} • Şarkı Sözleri (Lyrics)`,
              icon_url: client.settings.icon,
            },
            description: lyrics,

            thumbnail: {
              url: song.song_art_image_url,
            },
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