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

    if (!interaction.member.voice.channel)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Bir odada değilsin. Herhangi bir odaya geç ve tekrar dene!"
        }]
      });

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Aynı odada değiliz! Bulunduğum odaya katıl ve tekrar dene!"
        }]
      });

    const queue = client.distube.getQueue(interaction.guild);

    if (!queue || !queue.songs || queue.songs.length == 0)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Şu anda bir şarkı çalmıyor."
        }]
      });

    const track = queue.songs[0];

    if (!track) {
      client.logger.error("Şarkı bilgi komutunda şarkı çalıyor görünüyor ama şarkıyı bulamadı");

      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: "**»** Şarkı Bulunamadı!",
          description: `**•** İlginç bir şekilde. Çalıyor görünüyor ama şarkıyı bulamadım?`
        }]
      });
    }

    return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${client.user.username} • Şarkı Bilgileri`,
          icon_url: client.settings.icon
        },
        title: `**»** ${track.name}`,
        url: track.url,
        fields: [
          { name: '**»** Talep Eden', value: "**•** " + (track.user?.tag), inline: true },
          { name: '**»** Ses Yüksekliği', value: "**•** %" + queue.volume + "", inline: true },
          {
            name: '**»** Tekrarlama Modu',
            value: queue.repeatMode == 2 ? '**•** Mevcut sıra tekrarlanıyor.' : queue.repeatMode == 1 ? '**•** Mevcut şarkı tekrarlanıyor.' : '**•** Kapalı',
            inline: true
          },
          {
            name: `**»** Bassboost \`/bassboost\``,
            value: `**•** ${queue.filters.has('bassboost') ? queue.volume === 500 ? "BASSBOOST KÖKLENMİŞ! 🤯" : "Açık!" : "Kapalı"}`,
            inline: false
          },
          { name: '**»** Şarkı Sözleri', value: `**•** Şarkı sözleri için \`/şarkı-sözleri\` komutunu kullanabilirsin!`, inline: false },
          //{ name: `**»** Sayaç Çubuğu \`/ileri-sar\``, value: "**•** " + queue.createProgressBar({ timecodes: true }), inline: false }
          //{ name: '**»** Kanal', value: "**•** " + track.author, inline: true },
          //{ name: '**»** İzlenme Sayısı', value: "**•** " + new Intl.NumberFormat().format(track.views), inline: true },
          //{ name: '**»** Süresi', value: "**•** " + track.duration, inline: true },
          //{ name: '**»** Aktif Efektler', value: "**•** " + filters.length + '/' + client.filters.length, inline: true },
          //{ name: '**»** Durduruldu Mu?', value: queue.connection.paused ? '**•** Yes' : '**•** Hayır', inline: true },
          //{ name: '**»** Oynatma Listesinden Mi?', value: track.fromPlaylist ? '**•** Evet' : '**•** Hayır', inline: true },
        ],
        thumbnail: { url: track.thumbnail }
      }]
    });
  },
};