module.exports = {
  interaction: {
    name: "yürüt",
    description: "Duraklatılan şarkıyı devam ettirir.",
    options: []
  },
  aliases: ["resume", "sürdür"],
  category: "Music",
  cooldown: 5000,

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

    if (!queue.node.isPaused())
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: `**»** Şarkı zaten devam ediyor. Duraklatmak için: \`/durdur\``
        }]
      });

    queue.node.setPaused(false);

    return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        title: "**»** Şarkı Yürütülüyor!",
        description: `**•** Tekrardan duraklatmak için \`/durdur\` yazmanız yeterlidir.`
      }]
    });
  },
};