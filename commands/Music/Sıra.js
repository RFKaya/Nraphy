module.exports = {
  interaction: {
    name: "sıra",
    description: "Şarkı sırasını gösterir.",
    options: []
  },
  aliases: ["queue"],
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

    interaction.reply({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${interaction.guild.name} • Şarkı Sırası ${queue.repeatMode ? '(Tekrarlama Aktif)' : ''}`,
          icon_url: interaction.guild.iconURL()
        },
        description:
          `**Şu Anda Çalan:** ${queue.songs[0].name}\n\n` + // | ${nowPlaying.author}\n\n` +
          (queue.songs.slice(1, this.length).map((track, i) => {
            return `**#${i + 1}** - ${track.name}`; // | ${track.author} (**${track.requestedBy?.username}** tarafından eklendi.)`;
          }).slice(0, 10).join('\n') + `\n\n${queue.songs.length > 10 ? `ve **${queue.songs.length - 10}** şarkı daha...` : `**•** Sırada toplam **${queue.songs.length}** şarkı bulunuyor.`}`)
      }]
    });
  },
};