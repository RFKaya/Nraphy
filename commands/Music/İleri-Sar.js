const humanize = require("humanize-duration");

module.exports = {
  interaction: {
    name: "ileri-sar",
    description: "Çalan şarkıyı belirttiğiniz süre kadar ileri sarmanıza yarar.",
    options: [
      {
        name: "saniye",
        description: "Atlamak istediğin saniye miktarını gir.",
        type: 4,
        required: true
      },
    ]
  },
  interactionOnly: true,
  aliases: ["sar", "ilerisar", "ilerlet", "ilerle"],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 10000,
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

    const saniye = await interaction.options.getInteger("saniye");

    if (!saniye || isNaN(saniye) || saniye === 'Infinity')
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: "**»** **1** ve **100** Arasında Bir Sayı Girmelisin!",
          description: `**•** Örnek kullanım: \`/ileri-sar 50\``
        }]
      });

    if (Math.round(saniye) < 1 || Math.round(saniye) > queue.songs[0].duration)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: `**»** Girdiğin Sayı **1**'den Az veya **${queue.songs[0].duration}**'den Çok Olamaz!`,
          description: `**•** Örnek kullanım: \`/ileri-sar 35\``
        }]
      });

    let targetTime = Math.floor(queue.currentTime) + Math.floor(saniye);

    await queue.seek(targetTime);

    return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        title: `**»** Şarkı **${saniye} Saniye** İleri Sarıldı!`,
        description: `**•** Şarkı şuradan itibaren çalmaya başlanacak: \`${humanize(targetTime * 1000, { language: "tr", round: true })}\`!`
      }]
    });

  },
};