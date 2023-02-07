module.exports = {
  interaction: {
    name: "yürüt",
    description: "Duraklatılan şarkıyı devam ettirir.",
    options: []
  },
  aliases: ["resume"],
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

    if (!queue.connection.paused) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        description: `**»** Şarkı zaten devam ediyor. Duraklatmak için; \`/durdur\``
      }]
    });

    queue.setPaused(false);

    interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        title: "**»** Şarkı Yürütülüyor!",
        description: `**•** Tekrardan duraklatmak için \`/durdur\` yazmanız yeterlidir.`
      }]
    });
  },
};