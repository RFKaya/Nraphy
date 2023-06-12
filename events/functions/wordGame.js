const axios = require('axios');

module.exports = async (client, message, wordGame, guildData) => {

  try {

    if (message.content.startsWith("!") || message.content.startsWith(">") || message.author.bot) return;

    //---------------Permissions---------------//

    const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
    const permissions = require("../../utils/Permissions.json");

    let clientPerms = [];

    botPermissions.forEach((perm) => {
      if (!message.guild.channels.cache.get(wordGame.channel).permissionsFor(message.guild.members.me).has(perm)) {
        clientPerms.push(permissions[perm]);
      }
    });

    if (clientPerms.length > 0) {

      client.logger.log(`Kelime oyunu kanalında bir/birkaç yetkim bulunmadığı için kelime oyunu sistemi sıfırlanıyor... • ${message.guild.name} (${message.guild.id})`);
      guildData.wordGame.channel = undefined;
      guildData.markModified('wordGame');
      await guildData.save();

      return message.guild.channels.cache.get(wordGame.setupChannel)?.send({
        embeds: [{
          color: client.settings.embedColors.red,
          author: {
            name: `Kelime Oyununu Çalıştırabilmem İçin Gereken İzinlere Sahip Değilim!`,
            icon_url: message.guild.iconURL(),
          },
          description: `**»** ${message.guild.channels.cache.get(wordGame.channel)} kanalında yeterli yetkiye sahip olmadığım için kelime oyunu sistemini sıfırladım.`,
          fields: [
            {
              name: '**»** İhtiyacım Olan İzinler;',
              value: "**•** " + clientPerms.map((p) => `${p}`).join("\n**•** "),
            },
          ]
        }]
      }).catch(e => { });

    }

    //---------------Permissions---------------//

    //---------------Warner---------------//

    async function warner(user, title, description, deleteMessage = true) {

      //Uyarı Metni
      const userCache = client.userDataCache[user.id] || (client.userDataCache[user.id] = {});
      if (!userCache?.lastWarn || Date.now() - userCache.lastWarn > 5000) {
        userCache.lastWarn = Date.now();
        message.channel.send({
          content: user.toString(),
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: `**»** ${title}`,
              description: `**•** ${description}`
            }
          ]
        }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 4500));
      }

      //Mesaj Silme
      if (deleteMessage) message.delete().catch(e => { });

    }

    //---------------Warner---------------//

    //Üst Üste Yazma
    if (!wordGame.writeMore && wordGame.lastWord?.author == message.author.id) {
      return warner(
        message.author,
        "Hey, Dur! Üst Üste Kelimeler Türetemezsin",
        "Başka birisinin bir kelime türetmesini beklemelisin."
      );
    }

    //Sadece Düzgün Harfler Kullanmalısın!
    const ingilizceKarakterlerMapping = {
      'â': 'a',
      'Â': 'A',
      'ı': 'i',
      'İ': 'I',
      'ü': 'u',
      'Ü': 'U',
      'Ö': 'O',
      'ö': 'o',
      'Ç': 'C',
      'ç': 'c',
      'ş': 's',
      'Ş': 'S',
      'Ğ': 'G',
      'ğ': 'g'
    };
    if (/[^a-zA-Z]/.test(message.content.trim().split('').map(c => ingilizceKarakterlerMapping[c] || c).join(''))) {
      return warner(
        message.author,
        "Sadece Düzgün Harfler Kullanmalısın!",
        "Sayı, sembol veya boşluk içermemeli."
      );
    }

    //Muvaffakiyetsizleştiricileştiriveremeyebileceklerimizdenmişsinizcesine
    if (message.content.length > 70) {
      return warner(
        message.author,
        "Bu Kadar Uzun Sözcük yok! Aşağıdaki Sözcük Bile 70 Harf :D?",
        "Muvaffakiyetsizleştiricileştiriveremeyebileceklerimizdenmişsinizcesine."
      );
    }

    //Dayıcım Resim/Dosya Ne Alaka?
    if (!message.content) {
      return warner(
        message.author,
        "Dayıcım Resim/Dosya Ne Alaka?",
        "Yani açıklama yapmaya gerek yok. Bence tabii..."
      );
    }

    let küçükHarfliKelime = message.content.toLocaleLowerCase('tr-TR');
    let öncekiKelime = wordGame.lastWord?.word || "n";

    //Önceki Sözcükten Farklı Bir Sözcük Bulmalısın!
    if (öncekiKelime == küçükHarfliKelime) {
      return warner(
        message.author,
        "Önceki Sözcükten Farklı Bir Sözcük Bulmalısın!",
        `Son sözcük olan **${client.capitalizeFirstLetter(öncekiKelime, "tr")}** sözcüğünü belirtemezsin.`
      );
    }

    //Önceki Sözcüğün Son Harfiyle Başlayan Bir Sözcük Bulmalısın!
    if (küçükHarfliKelime.slice(0, 1) !== öncekiKelime.slice(-1)) {
      return warner(
        message.author,
        "Önceki Sözcüğün Son Harfiyle Başlayan Bir Sözcük Bulmalısın!",
        `Sözcüğün, **${öncekiKelime.slice(-1).toLocaleUpperCase('tr-TR')}** harfiyle başlamalı.`
      );
    }

    //1 Harfli Sözcük mü Olur ki?
    if (message.content.length < 2) {
      return warner(
        message.author,
        "1 Harfli Sözcük mü Olur ki?",
        "Olmaz ki! Yoksa olur mu? Yoo olmaz. Olma ihtimali var mı? :thinking:"
      );
    }

    //En Az 3 Harfli Bir Sözcük Bulmalısın!
    if (message.content.length < 3) {
      return warner(
        message.author,
        "En Az 3 Harfli Bir Sözcük Bulmalısın!",
        "Oyun basit olmasın diye böyle. Yapacak bir şey yok. :confused:"
      );
    }

    //Belirttiğin Sözcük Yakın Zamanda Kullanılmış!
    if (((wordGame.history?.concat(wordGame?.history || []))?.slice(-200) || []).includes(küçükHarfliKelime)) {
      return warner(
        message.author,
        "Belirttiğin Sözcük Yakın Zamanda Kullanılmış!",
        `Bu nedenle şu an **${client.capitalizeFirstLetter(küçükHarfliKelime, "tr")}** sözcüğünü kullanamazsın.`
      );
    }

    const webUyarlamaMapping = {
      'ı': '%C4%B1',
      'ş': "%C5%9F",
      'ü': "%C3%BC",
      'ç': "%C3%A7",
      'ğ': "%C4%9F",
      'ö': "%C3%B6",
      'İ': "i",
      ' ': "+"
    };
    let webUygunÇevirilmişKelime = küçükHarfliKelime.split('').map(c => webUyarlamaMapping[c] || c).join('');

    //Öyle Bir Kelime Yok kiii!
    if (
      !require('../../utils/TDK-Kelimeler.json').includes(küçükHarfliKelime) &&
      //(await axios.get(`https://sozluk.gov.tr/gts?ara=${webUygunÇevirilmişKelime}`))?.data?.error &&
      (await (axios.get(`https://sozluk.gov.tr/gts?ara=${webUygunÇevirilmişKelime}`)
        .then(result => {
          if (result.data?.error) return true;
          if (result.isAxiosError) return true;
          return false;
        })
        .catch(error => true)
      ))
    ) {
      return warner(
        message.author,
        "Öyle Bir Kelime Yok kiii!",
        `TDK'de **${client.capitalizeFirstLetter(küçükHarfliKelime, "tr")}** şeklinde bir sözcük bulunmuyor.`
      );
    }

    //Tepki
    message.react('✅')
      .catch(error => {
        if (error.code === 90001)
          warner(
            message.author,
            "Mesajına Tepki Ekleyemiyorum!",
            `Beni engellemiş olabilirsin :rage:\n` +
            `**•** İstersen [destek sunucumuzdan](https://discord.gg/VppTU9h) yardım alabilirsin 🥺`,
            false
          );
        else if (error.code !== 10008)
          client.logger.error(error);
      });

    //İstatistikler
    ((wordGame ||= {}).stats ||= {})[message.author.id] ||= { wordCount: 0, wordLength: 0 };
    wordGame.stats[message.author.id].wordCount += 1;
    wordGame.stats[message.author.id].wordLength += küçükHarfliKelime.length;

    //En uzun kelime
    if (küçükHarfliKelime.length > (wordGame.longestWord?.word?.length || 0))
      wordGame.longestWord = { author: message.author.id, word: küçükHarfliKelime };

    //Geçmiş
    (wordGame.history ||= []).push(küçükHarfliKelime);
    wordGame.history = wordGame.history.slice(-150);

    //Yumuşak G
    if (küçükHarfliKelime.slice(-1) == "ğ") {

      let yeniHarf = makeid(1).toLocaleLowerCase('tr-TR');

      message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: 'Nraphy • Kelime Oyunu',
              icon_url: client.settings.icon
            },
            title: `**»** Sözcüğün Yumuşak G İle Bitiyor!`,
            description: `**•** Bu yüzden bir sonraki sözcük **${yeniHarf.toLocaleUpperCase('tr-TR')}** harfiyle başlamalı.\n**•** Sıralamayı ve istatistikleri görmek için \`/sıralama\` yazabilirsin.`,
            /*fields: [
              {
                name: '**»** Bağlantılar',
                value: `**•** [Destek Sunucusu](https://discord.gg/VppTU9h) • [Davet Bağlantısı](${client.settings.invite})`,
              },
            ]*/
          }
        ]
      });

      //Son Kelime
      wordGame.lastWord = {
        word: küçükHarfliKelime + yeniHarf,
        author: message.author.id
      };

    } else {

      //Son Kelime
      wordGame.lastWord = {
        word: küçükHarfliKelime,
        author: message.author.id
      };

      //"Aynı harfi çok sık kullandınız" uyarısı
      if (wordGame.history?.length) {
        const counts = {};
        const sampleArray = ((wordGame.history?.concat(wordGame?.history || []))?.splice(0, 200) || []).slice(-6).map(word => word.slice(-1));
        sampleArray.forEach(async function (x) { counts[x] = (counts[x] || 0) + 1; });

        //Son 6 kelimenin 5'i aynı harfle bitiyosa
        let sonHarf = küçükHarfliKelime.slice(-1);
        let sonHarfinKullanımOranı = (counts[sonHarf] || 0);

        if (sonHarfinKullanımOranı >= 5) {
          let yeniHarf = makeid(1, sonHarf).toLocaleLowerCase('tr-TR');
          wordGame.lastWord = {
            word: küçükHarfliKelime + yeniHarf,
            author: message.author.id
          };

          message.channel.send({
            embeds: [
              {
                color: client.settings.embedColors.default,
                author: {
                  name: 'Nraphy • Kelime Oyunu',
                  icon_url: client.settings.icon
                },
                title: `**»** Ne Bu Sürekli Aynı Harf?!`,
                description: `**•** Bu yüzden bir sonraki sözcük **${yeniHarf.toLocaleUpperCase('tr-TR')}** harfiyle başlamalı.\n**•** Sıralamayı ve istatistikleri görmek için \`/sıralama\` yazabilirsin.`,
              }
            ]
          });
        }
      }
    }

    //Database
    guildData.markModified('wordGame');
    if (!client.guildsWaitingForSync.includes(message.guild.id)) client.guildsWaitingForSync.push(message.guild.id);

    function makeid(length, exemptLetter = "") {
      var result = '';
      var characters = 'ABCÇDEFGHİIJKLMNOÖPRSŞTUÜVYZ'.replace(exemptLetter?.toLocaleUpperCase('tr-TR'), '');
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
          charactersLength));
      }
      return result;
    }

  } catch (err) { client.logger.error(err); };
};
