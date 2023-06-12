const tcmbdoviz = require('tcmb-doviz');

module.exports = {
  name: "döviz",
  description: "Anlık kur değerini verir.",
  usage: "döviz",
  aliases: ["doviz", "kur", "dövizkur", "kuranaliz", "kurgetir", "dövizanaliz", "usd", "euro", "eur", "borsa"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 5000,
  ownerOnly: false,

  async execute(client, message, args, data) {

    return message.reply({ content: "Hata! TCMB API kaynaklı bir problemimiz mevcut. İlgili sorun giderilene kadar Döviz sistemleri bakımdadır.\n\nTahmini tarih: **Nisan, 2023**" });

    const birimler = ["USD", "EUR", "AUD", "DKK", "GBP", "CHF", "SEK", "CAD", "KWD", "NOK", "JPY", "SAR", "BGN", "RON", "RUB", "IRR", "CNY", "PKR", "QAR"];

    if (!args[0]) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bir Para Birimi Belirtmelisin! (USD, EUR, GBP vb.)',
          description: `**•** Örnek Kullanım: \`${data.prefix}döviz USD\``
        }
      ]
    });

    let birim = (args[0]).toUpperCase();

    if (birim.toLowerCase() == "dolar") birim = "USD";
    if (birim.toLowerCase() == "euro") birim = "EUR";

    if (!birimler.includes(birim)) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Hatalı Bir Birim Belirttin!',
          description: `**•** Lütfen doğru bir para birimi belirtin. \`USD, EUR, AZN vb.\``
        }
      ]
    });

    //message.channel.startTyping();
    const exchangeRate = await tcmbdoviz.getExchangeRate(birim);

    let embed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Döviz`,
        icon_url: client.settings.icon
      },
      title: `**»** **${exchangeRate.name} (${birim})** `,
      fields: [
        {
          name: `**»** Alış`,
          value: `**•** **₺**${exchangeRate.buying}`,
          inline: true
        },
        {
          name: `**»** Satış`,
          value: `**•** **₺**${exchangeRate.selling}`,
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: `Türkiye Cumhuriyeti Merkez Bankası`,
        icon_url: message.author.avatarURL(),
      },
    };

    if (args[1]) {
      let mesaj = (args[1]);

      let x = /(-)/;

      if (isNaN(mesaj) || mesaj.includes(',') || mesaj.includes('.') || mesaj.match(x)) return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Çarpmak İstediğin Miktarda Sadece Sayı Bulunmalı!',
            description: `**•** Örnek kullanım: \`${data.prefix}döviz USD 500\``
          }
        ]
      });

      if (mesaj < 1 || mesaj > 128000000000) return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Geçersiz Birim Belirttin!',
            description: `**•** En az **1 Birim**, en fazla **128.000.000.000 Birim** belirtebilirsin.`
          }
        ]
      });

      embed.fields.push({
        name: `**»** ${mesaj} ${exchangeRate.code}`,
        value: `**•** Alış **₺**${(mesaj * exchangeRate.buying).toFixed(2)}\n**•** Satış **₺**${(mesaj * exchangeRate.selling).toFixed(2)} `,
        inline: false
      });
    }

    message.channel.send({ embeds: [embed] });

  }
};