module.exports = {
  interaction: {
    name: "bitir",
    description: "Şarkı sırasını temizler ve odadan ayrılır.",
    options: []
  },
  aliases: ['dc', "stop", "leave", "ayrıl", "clear-queue", "cq", "st", "sırayıtemizle", "sırayı-temizle"],
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

    queue.stop();

    return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.default,
        title: "**»** Oynatma Sonlandırıldı!",
        description: `**•** Şarkı sırası temizlendi ve oynatma bitirildi.`
      }]
    });
  },
};