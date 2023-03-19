module.exports = {
  interaction: {
    name: "ses",
    description: "Ses seviyesini ayarlamanızı sağlar.",
    options: [
      {
        name: "ses",
        description: "1-200 arası bir seviye gir. (%100'den fazlası ses kalitesini düşürebilir)",
        type: 4,
        required: true
      },
    ]
  },
  interactionOnly: true,
  aliases: ["volume"],
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

    const ses = interaction.options.getInteger("ses");

    if (!ses || isNaN(ses) || ses === 'Infinity')
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: "**»** **1** ve **200** Arasında Bir Sayı Girmelisin!",
          description: `**•** Örnek kullanım: \`/ses 35\``
        }]
      });

    if (Math.round(parseInt(ses)) < 1 || Math.round(parseInt(ses)) > 200)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: "**»** Girdiğin Sayı **1**'den Az veya **200**'den Çok Olamaz!",
          description: `**•** Örnek kullanım: \`/ses 35\``
        }]
      });

    await queue.setVolume(parseInt(ses));

    interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        description: `**»** Ses seviyesi başarıyla **${parseInt(ses)}%** olarak ayarlandı!`
      }]
    });

  },
};