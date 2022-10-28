const Discord = require("discord.js");
var request = require("request");

module.exports = {
  interaction: {
    name: "trump",
    description: "Donald Trump'a bir tweet attırırsınız.",
    options: [
      {
        name: "yazı",
        description: "Trump'a söyletmek istediklerini yaz.",
        type: 3,
        required: true
      }
    ]
  },
  interactionOnly: true,
  aliases: ["trumpet"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const text = interaction.options.getString("yazı");

    const { messageChecker } = require("../../modules/Functions");
    await messageChecker(interaction, text, "trump KuRşUn İkİ bUçUk MiLyOn!");

    await interaction.deferReply();

    request(`https://nekobot.xyz/api/imagegen?type=trumptweet&text=${encodeURI(text)}`, function (error, response, body) {

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
              name: `${client.user.username} • Trump`,
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