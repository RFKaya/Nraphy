module.exports = {
  interaction: {
    name: "karıştır",
    description: "Sıradaki şarkıların sırasını karıştırır.",
    options: []
  },
  aliases: ['sh', "shuffle"],
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

    if (queue.tracks.size < 2)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: "**»** Sırada Yeterli Şarkı Bulunmuyor!",
          description: `**•** Sıraya **${2 - queue.tracks.size}** şarkı daha ekleyip tekrar dene.`
        }]
      });

    queue.tracks.shuffle();

    return await interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.green,
          title: "**»** Sıra Karıştırılıyor...",
          description: `**•** Sıradaki **${queue.tracks.size}** şarkı rastgele çalacak şekilde karıştırılıyor...`
        }
      ]
    });


  },
};