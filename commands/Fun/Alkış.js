module.exports = {
  interaction: {
    name: "alkış",
    description: "Alkışlar işte kardeşim ya!",
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
  aliases: ["alkışla"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {
    const text = interaction.options.getString("yazı");

    const { messageChecker } = require("../../modules/Functions");
    await messageChecker(interaction, text, "alkış Bravo!");

    interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${interaction.user.username} alkışlıyor!`,
            icon_url: interaction.user.displayAvatarURL(),
          },
          description: `**»** ${text}`,
          image: {
            url: 'https://media1.giphy.com/media/l4FGmpVCfhAUbVVE4/source.gif',
          }
        }
      ]
    });

  }
};