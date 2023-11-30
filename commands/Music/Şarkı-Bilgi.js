module.exports = {
  interaction: {
    name: "şarkı-bilgi",
    description: "Şu anda çalan şarkının bilgilerini verir."
  },
  aliases: ["np", "nowplaying", "now-playing", "şb", "şarkıbilgileri", "şarkıbilgi", "şarkı-bilgileri"],
  category: "Music",
  cooldown: false,

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

    const queue = client.player.useQueue(interaction.guildId);

    if (!queue?.isPlaying())
      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Şu anda bir şarkı çalmıyor."
          }
        ]
      });

    const track = queue.currentTrack;

    return await interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${client.user.username} • Şarkı Bilgileri`,
            icon_url: client.settings.icon
          },
          title: `**»** ${track.title}`,
          url: track.url,
          fields: [
            { name: '**»** Talep Eden', value: "**•** " + (track.requestedBy?.tag || "*Belirsiz*"), inline: true },
            { name: '**»** Ses Yüksekliği', value: "**•** %" + queue.node.volume, inline: true },
            {
              name: '**»** Tekrarlama Modu',
              value: queue.repeatMode == 2 ? '**•** Mevcut sıra tekrarlanıyor.' : queue.repeatMode == 1 ? '**•** Mevcut şarkı tekrarlanıyor.' : '**•** Kapalı',
              inline: true
            },
            {
              name: `**»** Bassboost \`/bassboost\``,
              value: `**•** ${queue.filters.ffmpeg.isEnabled("bassboost") ? "AÇIK! 🤯" : "Kapalı"}`,
              inline: false
            },
            { name: '**»** Şarkı Sözleri', value: `**•** Şarkı sözleri için \`/şarkı-sözleri\` komutunu kullanabilirsin!`, inline: false },
            { name: `**»** Sayaç Çubuğu`, value: "**•** " + queue.node.createProgressBar({ timecodes: true }), inline: false }
            //{ name: '**»** Kanal', value: "**•** " + track.author, inline: true },
            //{ name: '**»** İzlenme Sayısı', value: "**•** " + new Intl.NumberFormat().format(track.views), inline: true },
            //{ name: '**»** Süresi', value: "**•** " + track.duration, inline: true },
            //{ name: '**»** Aktif Efektler', value: "**•** " + filters.length + '/' + client.filters.length, inline: true },
            //{ name: '**»** Durduruldu Mu?', value: queue.connection.paused ? '**•** Yes' : '**•** Hayır', inline: true },
            //{ name: '**»** Oynatma Listesinden Mi?', value: track.fromPlaylist ? '**•** Evet' : '**•** Hayır', inline: true },
          ],
          thumbnail: { url: track.thumbnail }
        }
      ]
    });
  },
};