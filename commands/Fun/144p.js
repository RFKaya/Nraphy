const Discord = require("discord.js");
var request = require("request");

module.exports = {
  interaction: {
    name: "144p",
    description: "Profil resminizin kalitesini düşürür.",
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
  aliases: ['blur', '144p', 'bulanıklaştır'],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    await interaction.deferReply();

    let user = interaction.options.getUser("kullanıcı") || interaction.user;

    request(`https://nekobot.xyz/api/imagegen?type=jpeg&url=${user.displayAvatarURL({ dynamic: true, size: 512 })}`, function (error, response, body) {

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
              name: `${client.user.username} • 144p`,
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