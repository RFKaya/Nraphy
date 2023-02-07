const Discord = require("discord.js");
var request = require("request");

module.exports = {
  interaction: {
    name: "magik",
    description: "Profil fotoğrafınızı abuk subuk bir şeye çevirir.",
    options: [
      {
        name: "kullanıcı",
        description: "Bir kullanıcı ID'si ya da etiketi gir.",
        type: 6,
        required: false
      },
    ]
  },
  interactionOnly: true,
  aliases: ["magic", "megik"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 8000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    await interaction.deferReply();

    const user = interaction.options.getUser("kullanıcı") || interaction.user;

    request(`https://nekobot.xyz/api/imagegen?type=magik&image=${user.displayAvatarURL({ extension: "png", forceStatic: true, size: 256 })}`, function (error, response, body) {

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
              name: `${client.user.username} • Magik`,
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