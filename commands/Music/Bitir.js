module.exports = {
  interaction: {
    name: "bitir",
    description: "Şarkı sırasını temizler ve odadan ayrılır.",
    options: []
  },
  aliases: ["stop", "leave", "ayrıl", "clear-queue", "cq", "st", "sırayıtemizle", "sırayı-temizle"],
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

    queue.delete();

    return await interaction.reply({
      embeds: [{
        color: client.settings.embedColors.default,
        title: "**»** Oynatma Sonlandırıldı!",
        description: `**•** Şarkı sırası temizlendi ve oynatma bitirildi.`
      }]
    });
  },
};