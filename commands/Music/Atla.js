module.exports = {
  interaction: {
    name: "atla",
    description: "Anlık çalan şarkıyı atlar, sonraki şarkıya geçer.",
    options: []
  },
  aliases: ['sk', "skip"],
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

    if (!queue.node.isPlaying())
      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Oynatma durdurulmuş görünüyor. `/yürüt` ile yürüt ve tekrar dene."
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

    await queue.node.skip();

    return await interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        description: "**»** Şu anda çalan şarkı atlandı. Bir sonraki şarkıya geçiliyor..."
      }]
    });

  },
};