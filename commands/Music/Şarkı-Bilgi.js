module.exports = {
  interaction: {
    name: "şarkı-bilgi",
    description: "Şu anda çalan şarkının bilgilerini verir.",
    options: []
  },
  aliases: ["np", "nowplaying", "now-playing", "şb", "şarkıbilgileri", "şarkıbilgi", "şarkı-bilgileri"],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    if (!interaction.member.voice.channel) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        description: "**»** Bir odada değilsin. Herhangi bir odaya geç ve tekrar dene!"
      }]
    });

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        description: "**»** Aynı odada değiliz! Bulunduğum odaya katıl ve tekrar dene!"
      }]
    });

    const queue = client.player.getQueue(interaction.guild);

    if (!queue) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        description: "**»** Şu anda bir şarkı çalmıyor."
      }]
    });

    const track = queue.nowPlaying();

    if (!track) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        title: "**»** Şarkı Bulunamadı!",
        description: `**•** İlginç bir şekilde. Çalıyor görünüyor ama şarkıyı bulamadım?`
      }]
    });


    //const filters = [];

    //Object.keys(queue._activeFilters).forEach((filterName) => queue._activeFilters[filterName]) ? filters.push(filterName) : false;

    interaction.reply({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${client.user.username} • Şarkı Bilgileri`,
          icon_url: client.settings.icon
        },
        title: `**»** ${track.title}`,
        url: track.url,
        fields: [
          //{ name: '**»** Kanal', value: "**•** " + track.author, inline: true },
          //{ name: '**»** İzlenme Sayısı', value: "**•** " + new Intl.NumberFormat().format(track.views), inline: true },
          { name: '**»** Talep Eden', value: "**•** " + (track.requestedBy?.username), inline: true },
          //{ name: '**»** Süresi', value: "**•** " + track.duration, inline: true },


          { name: '**»** Ses Yüksekliği', value: "**•** %" + queue.options.initialVolume + "", inline: true },
          //{ name: '**»** Aktif Efektler', value: "**•** " + filters.length + '/' + client.filters.length, inline: true },

          //{ name: '**»** Durduruldu Mu?', value: queue.connection.paused ? '**•** Yes' : '**•** Hayır', inline: true },
          {
            name: '**»** Tekrarlama Modu',
            value: queue.repeatMode == 2 ? '**•** Mevcut sıra tekrarlanıyor.' : queue.repeatMode == 1 ? '**•** Mevcut şarkı tekrarlanıyor.' : '**•** Kapalı',
            inline: true
          },
          //{ name: '**»** Oynatma Listesinden Mi?', value: track.fromPlaylist ? '**•** Evet' : '**•** Hayır', inline: true },

          { name: '**»** Şarkı Sözleri', value: `**•** Şarkı sözleri için \`/şarkı-sözleri\` komutunu kullanabilirsiniz!`, inline: false },
          { name: `**»** Sayaç Çubuğu \`/ileri-sar\``, value: "**•** " + queue.createProgressBar({ timecodes: true }), inline: false }
        ],
        thumbnail: { url: track.thumbnail }
      }]
    });
  },
};