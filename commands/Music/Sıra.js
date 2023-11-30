module.exports = {
  interaction: {
    name: "sıra",
    description: "Şarkı sırasını gösterir.",
    options: []
  },
  aliases: ["queue", "kuyruk"],
  category: "Music",

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

    const queuedTracks = queue.tracks.toArray();
    if (!queuedTracks?.[0])
      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Sırada bir şarkı yok."
          }
        ]
      });

    const tracks = queuedTracks.map((track, index) => `**#${index + 1}** - [${track.title}](${track.url})`);

    return await interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${interaction.guild.name} • Şarkı Sırası`,// ${queue.repeatMode ? '(Tekrarlama Aktif)' : ''}`,
            icon_url: interaction.guild.iconURL()
          },
          description: tracks.length > 10
            ? `${tracks.slice(0, 10).join('\n')}\nve **${tracks.length - 10}** şarkı daha...`
            : tracks.join('\n')
          //`**Şu Anda Çalan:** ${queue.songs[0].name}\n\n` + // | ${nowPlaying.author}\n\n` +
          /* (queue.songs.slice(1, this.length).map((track, i) => {
            return `**#${i + 1}** - ${track.name}`; // | ${track.author} (**${track.requestedBy?.username}** tarafından eklendi.)`;
          }).slice(0, 10).join('\n') + `\n\n${queue.songs.length > 10 ? `ve **${queue.songs.length - 10}** şarkı daha...` : `**•** Sırada toplam **${queue.songs.length}** şarkı bulunuyor.`}`) */
        }
      ]
    });
  },
};