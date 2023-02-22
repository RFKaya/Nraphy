var request = require("request");

module.exports = {
  interaction: {
    name: "tarihte-bugün",
    description: "Tarihte bugün yaşanan rastgele bir olayı verir.",
    options: []
  },
  interactionOnly: true,
  aliases: ["tarihtebugün", "bugün"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,
  voteRequired: true,

  async execute(client, interaction, data) {

    await interaction.deferReply();

    request(`https://api.ubilisim.com/tarihtebugun/`, function (error, response, body) {

      if (error) {
        return interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Hatanın sebebini bilmiyorum.`
            }
          ]
        });
      } else if (!body) {
        return interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Hatanın sebebini bilmiyorum.`
            }
          ]
        });
      }

      var olay = JSON.parse(body).tarihtebugun[Math.floor(Math.random() * JSON.parse(body).tarihtebugun.length)];

      interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Tarihte Bugün`,
              icon_url: client.settings.icon,
            },
            title: `**»** ${olay.Durum} - ${olay.Gun}.${olay.Ay}.${olay.Yil}`,
            description: `**•** ${olay.Olay}`
          }
        ]
      });

    });

  }
};