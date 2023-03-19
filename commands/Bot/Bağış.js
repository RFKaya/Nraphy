const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "bağış",
    description: "Bot geliştiricisine yemek ısmarlamanız için yardımcı olur.",
    options: []
  },
  aliases: [],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    return interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Canın Sağ Olsun Kardeeş! 💖',
          description: '**•** Valla ihtiyaç yok, düşünmen yeterli 😇',
        }
      ],
      components: [
        {
          data: { type: 1 }, components: [
            new ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')
          ]
        },
      ]
    });

  }
};