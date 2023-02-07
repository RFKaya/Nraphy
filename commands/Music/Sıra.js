module.exports = {
  interaction: {
    name: "sıra",
    description: "Şarkı sırasını gösterir.",
    options: []
  },
  interactionOnly: false,
  aliases: ["queue"],
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

    if (!queue || !queue.nowPlaying()) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        description: "**»** Şu anda bir şarkı çalmıyor."
      }]
    });

    const nowPlaying = queue.nowPlaying();

    interaction.reply({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${interaction.guild.name} • Şarkı Sırası ${queue.repeatMode ? '(Tekrarlama Aktif)' : ''}`,
          icon_url: interaction.guild.iconURL()
        },
        description: `**Şu Anda Çalan:** ${nowPlaying.title} | ${nowPlaying.author}\n\n` + (queue.tracks.map((track, i) => {
          return `**#${i + 1}** - ${track.title} | ${track.author} (**${track.requestedBy?.username}** tarafından eklendi.)`;
        }).slice(0, 10).join('\n') + `\n\n${queue.tracks.length > 10 ? `ve **${queue.tracks.length - 10}** şarkı daha...` : `Sırada toplam **${queue.tracks.length}** şarkı bulunuyor.`}`)
      }]
    });
  },
};