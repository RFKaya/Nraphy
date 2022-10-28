const Discord = require("discord.js");
var request = require("request");

module.exports = {
  interaction: {
    name: "tweet",
    description: "Kendi adınıza sahte bir tweet atarsınız.",
    options: [
      {
        name: "yazı",
        description: "Tweet'inde yazmasını istediğini yaz.",
        type: 3,
        required: true
      }
    ]
  },
  interactionOnly: true,
  aliases: ["twitter"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const text = interaction.options.getString("yazı");

    const { messageChecker } = require("../../modules/Functions");
    await messageChecker(interaction, text, "tweet Nraphy öz botumdur!");

    await interaction.deferReply();

    request(`https://nekobot.xyz/api/imagegen?type=tweet&text=${encodeURI(text)}&username=${encodeURI(interaction.user.username)}&raw=512`, function (error, response, body) {

      if (error || !body || !JSON.parse(body).success)
        return interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Hatanın sebebini bilmiyorum.`
            }
          ]
        });

      interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Tweet (Twitter)`,
              icon_url: client.settings.icon,
            },
            image: {
              url: JSON.parse(body).message,
            }
          }
        ]
      });

    });

  }
};