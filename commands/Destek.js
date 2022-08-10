const { MessageButton } = require('discord.js');

module.exports = {
  interaction: {
    name: "destek",
    description: "Destek sunucumuza ulaşabilmeniz için bir bağlantı verir.",
    options: []
  },
  aliases: [],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    let destekSunucusuButon = new MessageButton().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('LINK');

    interaction.reply({
      embeds: [
        {
          color: client.settings.color,
          title: '**»** Destek sunucumuza ulaşmak için buraya tıkla!',
          url: "https://discord.gg/QvaDHvuYVm",
          author: {
            name: `${client.user.username} • Bot Destek Sunucusu Bağlantısı`,
            icon_url: client.settings.icon,
          },
          timestamp: new Date(),
          footer: {
            text: `${(interaction.type == "APPLICATION_COMMAND") ? interaction.user.username : interaction.author.username} tarafından istendi.`,
            icon_url: (interaction.type == "APPLICATION_COMMAND") ? interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }) : interaction.author.displayAvatarURL({ dynamic: true, size: 1024 }),
          },
        }
      ],
      components: [
        {
          type: 1, components: [
            destekSunucusuButon
          ]
        },
      ]
    });

  }
};
