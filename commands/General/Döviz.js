const { parse } = require('node-html-parser');

module.exports = {
  interaction: {
    name: "döviz",
    description: "Anlık kur değerini verir.",
    options: [
      {
        name: "birim",
        description: "Hangi döviz birimini istediğini gir.",
        choices: [
          { name: "Dolar", value: "dolar" },
          { name: "Euro", value: "euro" },
          { name: "Sterlin", value: "sterlin" },
          { name: "Gram Altın", value: "gold" },
          { name: "Bitcoin", value: "btc" },
        ],
        type: 3,
        required: false
      },
    ]
  },
  aliases: ["doviz", "kur", "dövizkur", "kuranaliz", "kurgetir", "dövizanaliz", "usd", "euro", "eur", "borsa"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 5000,
  ownerOnly: false,

  async akf() {

    const sayfa = await fetch("https://doviz.com/doviz").then(res => res.text());
    const document = parse(sayfa);
    return document.querySelectorAll("a[data-ga-event='header_asset_click']")
      .map(c => ({
        name: c.querySelector("span.name").text,
        value: c.querySelector("span.value").text
      }));

  },

  async execute(client, interaction, data, args) {

    const birim = interaction.type == 2
      ? interaction.options.getString("birim")
      : (args[0])?.toLowerCase();

    const kurlar = await this.akf();

    if (!birim) {

      return await interaction.reply({
        embeds: [
          {

            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Döviz`,
              icon_url: client.settings.icon
            },
            fields: kurlar.map(k => ({ name: `**»** ${k.name}`, value: `**•** ${k.value}`, inline: true }))
          },
        ]
      });

    } else {

      const kurlarMapping = {
        "dolar": "DOLAR",
        "euro": "EURO",
        "sterlin": "STERLİN",
        "gold": "GRAM ALTIN",
        "btc": "BITCOIN",

        "usd": "DOLAR",
        "eur": "EURO",
        "altın": "GRAM ALTIN",
        "bitcoin": "BITCOIN"
      };

      const kur = kurlar.find(k => k.name === kurlarMapping[birim]);

      if (!kur)
        return await interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Hatalı Bir Birim Belirttin!',
              description: `**•** Lütfen doğru bir para birimi belirt. \`USD, EUR, Altın vb.\``
            }
          ]
        });

      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Döviz`,
              icon_url: client.settings.icon
            },
            fields: [
              {
                name: `**»** ${kurlarMapping[birim]}`,
                value: `**•** \`${kur.value}₺\``
              }
            ]
          },
        ]
      });

    }

    //return message.reply({ content: "Hata! TCMB API kaynaklı bir problemimiz mevcut. İlgili sorun giderilene kadar Döviz sistemleri bakımdadır.\n\nTahmini tarih: **Nisan, 2023**" });

    //const birimler = ["USD", "EUR", "AUD", "DKK", "GBP", "CHF", "SEK", "CAD", "KWD", "NOK", "JPY", "SAR", "BGN", "RON", "RUB", "IRR", "CNY", "PKR", "QAR"];

    /* if (!args[0])
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Para Birimi Belirtmelisin! (USD, EUR, GBP vb.)',
            description: `**•** Örnek Kullanım: \`${data.prefix}döviz USD\``,
        fields: [
        {
          name: `**»** Sorumluluk Reddi Beyanı`,
          value: `**•** \`kanove görüntülenen döviz kurlarının doğruluğunu garanti edemez ve hiçbir sorumluluk kabul etmemektedir. Döviz kurlarındaki değişikliklerden etkilenebilecek işlemleri yapmadan önce geçerli kurları doğrulamanız gerekir.\``,
          inline: false
        }
      ]
          },
        ]
    });
    
    let birim = (args[0]).toUpperCase();
    if (birim.toLowerCase() == "dolar") birim = "USD";
    if (birim.toLowerCase() == "euro") birim = "EUR";
    
    const tümDövizler = await epixdoviz.doviz();
    const exchangeRate = tümDövizler.find(doviz => doviz.kur == birim);
    
    if (!exchangeRate)
    return message.channel.send({
    embeds: [
      {
        color: client.settings.embedColors.red,
        title: '**»** Hatalı Bir Birim Belirttin!',
        description: `**•** Lütfen doğru bir para birimi belirtin. \`USD, EUR, AZN vb.\``
      }
    ]
    });
    
    let embed = {
    color: client.settings.embedColors.default,
    author: {
    name: `${client.user.username} • Döviz`,
    icon_url: client.settings.icon
    },
    title: `**»** **${exchangeRate.isim} (${exchangeRate.kur})** `,
    //description: `**• Sorumluluk Reddi Beyanı:** kanove görüntülenen döviz kurlarının doğruluğunu garanti edemez ve hiçbir sorumluluk kabul etmemektedir. Döviz kurlarındaki değişikliklerden etkilenebilecek işlemleri yapmadan önce, geçerli kurları doğrulamanız gerekir.`,
    fields: [
    {
      name: `**»** Alış`,
      value: `**•** **₺**${exchangeRate.alis}`,
      inline: true
    },
    {
      name: `**»** Satış`,
      value: `**•** **₺**${exchangeRate.satis}`,
      inline: true
    },
    {
      name: `**»** Sorumluluk Reddi Beyanı`,
      value: `**•** \`kanove görüntülenen döviz kurlarının doğruluğunu garanti edemez ve hiçbir sorumluluk kabul etmemektedir. Döviz kurlarındaki değişikliklerden etkilenebilecek işlemleri yapmadan önce geçerli kurları doğrulamanız gerekir.\``,
      inline: false
    }
    ],
    timestamp: new Date().toISOString(),
    footer: {
    text: `Kaynak: Türkiye Cumhuriyeti Merkez Bankası`,
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
    
    message.channel.send({ embeds: [embed] }); */

  }
};