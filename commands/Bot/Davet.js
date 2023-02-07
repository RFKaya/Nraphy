const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "davet",
    description: "Botu sunucunuza davet edebilmeniz için bir bağlantı verir.",
    options: []
  },
  aliases: ['invitelink', 'invite-link', 'davetlink', 'davetkod', 'davetkodu', 'davetlinki', 'davet-kod', 'davet-link', 'davet-kodu', 'davet-linki', 'davet', 'invite'],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    let davetBağlantısıButon = new ButtonBuilder().setLabel('Davet Bağlantısı').setURL(client.settings.invite).setStyle('Link');

    interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Botun davet bağlantısına ulaşmak için buraya tıkla!',
          url: client.settings.invite,
          author: {
            name: `${client.user.username} • Bot Davet Bağlantısı`,
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
            davetBağlantısıButon
          ]
        },
      ]
    });

  }
};