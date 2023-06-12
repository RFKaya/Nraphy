const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "atla",
    description: "Anlık çalan şarkıyı atlar, sonraki şarkıya geçer.",
    options: []
  },
  aliases: ['sk', "skip"],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
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

    try {

      await queue.skip();

      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.green,
          description: "**»** Şu anda çalan şarkı atlandı. Bir sonraki şarkıya geçiliyor..."
        }]
      });

    } catch (error) {

      if (error.errorCode === "NO_UP_NEXT") {

        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.red,
            title: "**»** Sırada Bir Şarkı Yok Ki!",
            description: "**•** Tabii `/bitir` yazarsan burayı terk edebilirim 🥺"
          }]
        });

      } else {

        client.logger.error(error);
        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.red,
            title: "**»** Bir Hata Oluştu!",
            description:
              `**•** Hatayla ilgili geliştirici bilgilendirildi.\n` +
              `**•** En kısa sürede çözülecektir.`
          }],
          components: [
            {
              type: 1, components: [
                new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link')
              ]
            },
          ]
        });

      }

    }

  },
};