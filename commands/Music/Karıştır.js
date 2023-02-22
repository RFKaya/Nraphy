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

    if (queue.songs.length <= 2)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: "**»** Sırada Yeterli Şarkı Bulunmuyor!",
          description: `**•** Sıraya **${3 - queue.songs.length}** şarkı daha ekleyip tekrar dene.`
        }]
      });

    queue.shuffle();

    return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        title: "**»** Sıra Karıştırılıyor...",
        description: `**•** Sıradaki **${queue.songs.length - 1}** şarkı rastgele çalacak şekilde karıştırılıyor...`
      }]
    });


  },
};