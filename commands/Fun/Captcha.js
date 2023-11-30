const fetch = require('node-fetch');

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

    const response = await fetch(`https://nekobot.xyz/api/imagegen?type=captcha&url=${(interaction.type === 2 ? interaction.user : interaction.author).displayAvatarURL({ extension: "png", size: 256 })}&username=${encodeURI(text).replaceAll('#', '%23')}`);
    const responseData = await response.json();

    if (!responseData.success) {
      client.logger.error("CAPTCHA komutunda bir sorun oluştu kardeeş.", responseData);
      client.logger.log(responseData);

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
      else return interaction.reply(messageContent);
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
            url: responseData.message,
          }
        }
      ]
    };
    if (interaction.type === 2)
      return interaction.editReply(messageContent);
    else return interaction.reply(messageContent);

  }
};