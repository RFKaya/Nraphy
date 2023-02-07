const Discord = require("discord.js");

module.exports = {
  name: "yazı-tura",
  description: "Göklere doğru bir Türk Lirası fırlatır.",
  usage: "yazı-tura",
  aliases: ["yazıtura"],
  category: "Games",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    const yazıtura = ["Yazı", "Tura"];
    const cevaplar = [
      "Yazı-tura yapacak parayı nereden buldun? 😂",
      "Hile yov hep hile yapıyorlar!",
      "Aaa bak ne geldi şansına.",
      "Eee ne oldu kazandık mı şimdi?",
      "Şovumuz bitti kardeşim hadi işine.",
      "Ya-ya-ya-yazı! Tu-tu-tu-tura!",
      "Para yere düşene kadar 90 kuruş oldu."
    ];

    var yt = yazıtura[Math.floor(Math.random() * yazıtura.length)];
    var cevap = cevaplar[Math.floor(Math.random() * cevaplar.length)];

    message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${message.author.username} bir para fırlattı!`,
            icon_url: message.author.avatarURL(),
          },
          image: {
            url: 'https://media.discordapp.net/attachments/595332283792359424/617504444979871847/tumblr_osncjxKz5o1tqx9n9o1_500_S.gif',
          },
        }
      ]
    }).then(mesaj => {
      setTimeout(() => {
        if (yt === "Tura") {
          mesaj.edit({
            embeds: [
              {
                color: client.settings.embedColors.default,
                title: `**»** ${yt} geldi!`,
                author: {
                  name: `${message.author.username} bir para çevirdi!`,
                  icon_url: message.author.avatarURL(),
                },
                description: "**•** " + cevap,
                thumbnail: {
                  url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/1TL_reverse.png',
                },
              }
            ]
          });
        } else if (yt === "Yazı") {
          mesaj.edit({
            embeds: [
              {
                color: client.settings.embedColors.default,
                title: `**»** ${yt} geldi!`,
                author: {
                  name: `${message.author.username} bir para çevirdi!`,
                  icon_url: message.author.avatarURL(),
                },
                description: "**•** " + cevap,
                thumbnail: {
                  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/1TL_obverse.png/199px-1TL_obverse.png',
                },
              }
            ]
          });
        }
      }, 4000);
    });

  }
};