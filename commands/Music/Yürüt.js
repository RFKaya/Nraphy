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
  cooldown: 5000,
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

    if (!queue.paused)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: `**»** Şarkı zaten devam ediyor. Duraklatmak için: \`/durdur\``
        }]
      });

    queue.resume();

    return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        title: "**»** Şarkı Yürütülüyor!",
        description: `**•** Tekrardan duraklatmak için \`/durdur\` yazmanız yeterlidir.`
      }]
    });
  },
};