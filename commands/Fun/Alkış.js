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
  aliases: ["alkışla"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    const text = interaction.type === 2 ? interaction.options.getString("yazı") : args.join(" ");

    const { messageChecker } = require("../../modules/Functions");
    if (!await messageChecker(interaction, text, "alkış Bravo!")) return;

    return interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${(interaction.type === 2 ? interaction.user : interaction.author).username} alkışlıyor!`,
            icon_url: (interaction.type === 2 ? interaction.user : interaction.author).displayAvatarURL(),
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