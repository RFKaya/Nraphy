const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "destek",
    description: "Destek sunucumuza ulaşabilmeniz için bir bağlantı verir.",
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

    let destekSunucusuButon = new ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link');

    interaction.reply({
      content: `<https://discord.gg/QvaDHvuYVm>`,
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Destek sunucumuza ulaşmak için buraya tıkla!',
          url: "https://discord.gg/QvaDHvuYVm",
          author: {
            name: `${client.user.username} • Bot Destek Sunucusu Bağlantısı`,
            icon_url: client.settings.icon,
          },
          timestamp: new Date(),
          footer: {
            text: `${(interaction.type == 2) ? interaction.user.username : interaction.author.username} tarafından istendi.`,
            icon_url: (interaction.type == 2) ? interaction.user.displayAvatarURL() : interaction.author.displayAvatarURL(),
          },
        }
      ],
      components: [
        {
          data: { type: 1 }, components: [
            destekSunucusuButon
          ]
        },
      ]
    });

  }
};