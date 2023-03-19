var request = require('request');

module.exports = {
  interaction: {
    name: "köpek",
    description: "Rastgele köpek fotoğrafları verir.",
    options: [],
  },
  aliases: ['dog', "köpke"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const cevaplar = [
      "Hav 🐶",
      "Sivas kangalı",
      "Köpke",
      "Ouyn istiyo abisi",
      "Hrrrr 🐶"
    ];

    var cevap = cevaplar[Math.floor(Math.random() * cevaplar.length)];

    //interaction.deferReply();

    request(`https://dog.ceo/api/breeds/image/random`, function (error, response, body) {

      if (error || !body || !JSON.parse(body)?.message)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Hatanın sebebini bilmiyorum.`
            }
          ]
        });

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Köpek`,
              icon_url: client.settings.icon,
            },
            title: `**»** ${cevap}`,
            image: {
              url: JSON.parse(body).message,
            }
          }
        ]
      });

    });

  }
};