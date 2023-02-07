module.exports = {
  interaction: {
    name: "karıştır",
    description: "Sıradaki şarkıların sırasını karıştırır.",
    options: []
  },
  aliases: ['sh', "shuffle"],
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

    const success = queue.shuffle();

    if (success) {
      interaction.reply({
        embeds: [{
          color: client.settings.embedColors.green,
          title: "**»** Sıra Karıştırılıyor...",
          description: `**•** Sıradaki **${queue.tracks.length}** şarkı rastgele çalacak şekilde karıştırılıyor...`
        }]
      });
    } else {
      interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: "**»** Sıra Karıştırılamadı!",
          description: `**•** Sırada yeterli şarkı bulunmuyor. Sıraya **${3 - queue.tracks.length}** şarkı daha ekleyip tekrar dene.`
        }]
      });
    }
  },
};