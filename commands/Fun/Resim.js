var request = require('request');

module.exports = {
  interaction: {
    name: "resim",
    description: "Rastgele kedi/köpek fotoğrafları verir.",
    options: [
      {
        name: "kedi",
        description: "Rastgele kedi fotoğrafları verir.",
        type: 1,
        options: []
      },
      {
        name: "köpek",
        description: "Rastgele köpek fotoğrafları verir.",
        type: 1,
        options: []
      },
    ],
  },
  interactionOnly: true,
  aliases: ['cat', 'keddy', "kedy", 'dog', "köpke"],
  category: "Fun",
  cooldown: 3000,

  async execute(client, interaction, data) {

    const command = interaction.options.getSubcommand();

    if (command == "kedi") {

      const cevaplar = [
        "Miyaaav 🐱",
        "Sa krds bn kedi 🐱",
        "Keddy",
        "Bu kediler uzaylı bence.",
        "Ya çen kedi miçin çen?"
      ];

      let cevap = cevaplar[Math.floor(Math.random() * cevaplar.length)];

      //interaction.deferReply();

      request(`https://api.thecatapi.com/v1/images/search`, async function (error, response, body) {

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

        return await interaction.reply({
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

    } else if (command == "köpek") {

      const cevaplar = [
        "Hav 🐶",
        "Sivas kangalı",
        "Köpke",
        "Ouyn istiyo abisi",
        "Hrrrr 🐶"
      ];

      let cevap = cevaplar[Math.floor(Math.random() * cevaplar.length)];

      //interaction.deferReply();

      request(`https://dog.ceo/api/breeds/image/random`, async function (error, response, body) {

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

        return await interaction.reply({
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

  }
};