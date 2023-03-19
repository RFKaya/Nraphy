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
  interactionOnly: false,
  aliases: ['blur', '144p', 'bulanıklaştır'],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    if (interaction.type === 2) {
      await interaction.deferReply();
      var user = interaction.options.getUser("kullanıcı") || interaction.user;
    } else {
      var user = interaction.mentions.users.first() || client.users.cache.get(args[0]) || interaction.author;
    }

    request(`https://nekobot.xyz/api/imagegen?type=jpeg&url=${user.displayAvatarURL({ size: 512 })}`, function (error, response, body) {

      if (error || !body || !JSON.parse(body).success) {
        let message = {
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Hatanın sebebini bilmiyorum.`
            }
          ]
        };
        if (interaction.type === 2) {
          return interaction.editReply(message);
        } else {
          return interaction.reply(message);
        }
      }

      let message = {
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
      };

      if (interaction.type === 2) {
        return interaction.editReply(message);
      } else {
        return interaction.reply(message);
      }

    });
  }
};