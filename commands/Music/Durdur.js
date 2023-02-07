module.exports = {
  interaction: {
    name: "durdur",
    description: "Çalan şarkıyı duraklatır.",
    options: []
  },
  aliases: ["pause", "dur"],
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

    if (queue.connection.paused) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        description: `**»** Şarkı zaten duraklatıldı. Devam ettirmek için; \`/yürüt\``
      }]
    });

    queue.setPaused(true);

    interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        title: "**»** Şarkı Duraklatıldı!",
        description: `**•** Devam ettirmek için \`/yürüt\` yazmanız yeterlidir.`
      }]
    });
  },
};