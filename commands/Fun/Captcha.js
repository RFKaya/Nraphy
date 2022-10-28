const Discord = require("discord.js");
var request = require("request");

module.exports = {
  interaction: {
    name: "captcha",
    description: "Deneyerek görebilirsiniz.",
    options: [
      {
        name: "yazı",
        description: "Captcha doğrulamasının başlığını yaz.",
        type: 3,
        required: true
      }
    ]
  },
  interactionOnly: true,
  aliases: ["hcaptcha", "recaptcha"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const text = interaction.options.getString("yazı");

    const { messageChecker } = require("../../modules/Functions");
    await messageChecker(interaction, text, "captcha Adam gibi adamları işaretle!");

    await interaction.deferReply();

    request(`https://nekobot.xyz/api/imagegen?type=captcha&url=${interaction.user.displayAvatarURL({ size: 256 })}&username=${encodeURI(text)}`, function (error, response, body) {

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
              name: `${client.user.username} • Captcha`,
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