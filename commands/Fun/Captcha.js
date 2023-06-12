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
  aliases: ["hcaptcha", "recaptcha"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    const text = interaction.type === 2 ? interaction.options.getString("yazı") : args.join(" ");

    const { messageChecker } = require("../../modules/Functions");
    if (!await messageChecker(interaction, text, "captcha Adam gibi adamları işaretle!")) return;

    if (interaction.type === 2) await interaction.deferReply();

    request(`https://nekobot.xyz/api/imagegen?type=captcha&url=${(interaction.type === 2 ? interaction.user : interaction.author).displayAvatarURL({ size: 256 })}&username=${encodeURI(text)}`, function (error, response, body) {

      if (error || !body || !JSON.parse(body).success) {
        client.logger.error(error);

        let messageContent = {
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Hatanın sebebini bilmiyorum.`
            }
          ]
        };
        if (interaction.type === 2)
          return interaction.editReply(messageContent);
        else return interaction.edit(messageContent);
      }

      let messageContent = {
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
      };
      if (interaction.type === 2)
        return interaction.editReply(messageContent);
      else return interaction.reply(messageContent);

    });

  }
};