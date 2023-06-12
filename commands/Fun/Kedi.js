var request = require('request');

module.exports = {
  interaction: {
    name: "kedi",
    description: "Rastgele kedi fotoğrafları verir.",
    options: [],
  },
  aliases: ['cat', 'keddy', "kedy"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const cevaplar = [
      "Miyaaav 🐱",
      "Sa krds bn kedi 🐱",
      "Keddy",
      "Bu kediler uzaylı bence.",
      "Ya çen kedi miçin çen?"
    ];

    var cevap = cevaplar[Math.floor(Math.random() * cevaplar.length)];

    //interaction.deferReply();

    request(`https://api.thecatapi.com/v1/images/search`, function (error, response, body) {
      
      if (error || !body || !JSON.parse(body)[0]?.url)
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
              name: `${client.user.username} • Kedi`,
              icon_url: client.settings.icon,
            },
            title: `**»** ${cevap}`,
            image: {
              url: JSON.parse(body)[0].url,
            }
          }
        ]
      });

    });

  }
};