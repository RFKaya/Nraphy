const Discord = require("discord.js");

module.exports = {
  interaction: {
    name: "zar",
    description: "Senin için bir zar fırlatır.",
    options: []
  },
  interactionOnly: true,
  aliases: ["zar-at", "zarat"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${interaction.user.username} bir zar attı!`,
            icon_url: interaction.user.avatarURL({ dynamic: true }),
          },
          image: {
            url: 'https://cdn.discordapp.com/attachments/614117053699457053/777122364566798336/zar.gif',
          },
        }
      ]
    })

    const zar = ["1", "2", "3", "4", "5", "6"];
    var sayı = zar[Math.floor(Math.random() * zar.length)];

    if (sayı === "6") { var embedImage = "https://cdn.discordapp.com/attachments/614117053699457053/777135174814662677/6.png" }
    else if (sayı === "5") { var embedImage = "https://cdn.discordapp.com/attachments/614117053699457053/777135336592637992/5.png" }
    else if (sayı === "4") { var embedImage = "https://cdn.discordapp.com/attachments/614117053699457053/777135751816544256/4.png" }
    else if (sayı === "3") { var embedImage = "https://cdn.discordapp.com/attachments/614117053699457053/777135761873960990/3.png" }
    else if (sayı === "2") { var embedImage = "https://cdn.discordapp.com/attachments/614117053699457053/777135771014135838/2.png" }
    else if (sayı === "1") { var embedImage = "https://cdn.discordapp.com/attachments/614117053699457053/777135783290208286/1.png" }

    setTimeout(() => {
      interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${interaction.user.username} bir zar attı!`,
              icon_url: interaction.user.avatarURL({ dynamic: true }),
            },
            title: `**»** ${sayı} geldi!`,
            image: {
              url: embedImage,
            },
          }
        ]
      })
    }, 2400);

  }
};