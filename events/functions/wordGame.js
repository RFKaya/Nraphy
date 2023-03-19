//const request = require("request");
//const db = require("quick.db");
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
      //db.delete(`guilds.${message.guild.id}.wordGame.channel`);
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
      });

    }

    //---------------Permissions---------------//

    //---------------Warner---------------//

    async function warner(user, title, description) {

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
      message.delete().catch(e => { });

    }

    //---------------Warner---------------//

    const guildDataQueue = global.client.databaseQueue.guilds[message.guild.id] ||= {};

    //Üst Üste Yazma
    if (!wordGame.writeMore && (guildDataQueue.wordGame?.lastWord || wordGame.lastWord)?.author == message.author.id) {
      return warner(
        message.author,
        "Hey, Dur! Üst Üste Kelimeler Türetemezsin",
        "Başka birisinin bir kelime türetmesini beklemelisin."
      );
    }

    //Sadece Düzgün Harfler Kullanmalısın!
    const ingilizceKarakterlerMapping = {
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

    let küçükHarfliKelime = message.content.toLocaleLowerCase('tr-TR');
    let öncekiKelime = guildDataQueue.wordGame?.lastWord?.word || wordGame.lastWord?.word || "n";

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

    //Belirttiğin Sözcük Yakın Zamanda Kullanılmış!
    if (((wordGame.history?.concat(guildDataQueue.wordGame?.history || []))?.slice(-200) || []).includes(küçükHarfliKelime)) {
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
    message.react('✅');

    //İstatistikler
    /*db.add(`guilds.${message.guild.id}.wordGame.stats.${message.author.id}.wordCount`, 1);
    db.add(`guilds.${message.guild.id}.wordGame.stats.${message.author.id}.wordLength`, küçükHarfliKelime.length);*/
    ((guildDataQueue.wordGame ||= {}).stats ||= {})[message.author.id] ||= {};
    guildDataQueue.wordGame.stats[message.author.id].wordCount ||= 0;
    guildDataQueue.wordGame.stats[message.author.id].wordCount += 1;
    guildDataQueue.wordGame.stats[message.author.id].wordLength ||= 0;
    guildDataQueue.wordGame.stats[message.author.id].wordLength += küçükHarfliKelime.length;

    //En uzun kelime
    //if (!wordGame.longestWord || küçükHarfliKelime.length > wordGame.longestWord.word.length) db.set(`guilds.${message.guild.id}.wordGame.longestWord`, { author: message.author.id, word: küçükHarfliKelime });
    if (küçükHarfliKelime.length > ((guildDataQueue.wordGame.longestWord || wordGame.longestWord)?.word?.length || 0))
      guildDataQueue.wordGame.longestWord = { author: message.author.id, word: küçükHarfliKelime };

    //Geçmiş
    /*if (wordGame.history && wordGame.history.length > 200) {
      wordGame.history.shift();
      db.set(`guilds.${message.guild.id}.wordGame.history`, wordGame.history);
    };
    db.push(`guilds.${message.guild.id}.wordGame.history`, küçükHarfliKelime);*/
    (guildDataQueue.wordGame.history ||= []).push(küçükHarfliKelime);

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
      /*db.set(`guilds.${message.guild.id}.wordGame.lastWord`, {
        word: küçükHarfliKelime + yeniHarf,
        author: message.author.id
      });*/
      guildDataQueue.wordGame.lastWord = {
        word: küçükHarfliKelime + yeniHarf,
        author: message.author.id
      };

    } else {

      //Son Kelime
      /*db.set(`guilds.${message.guild.id}.wordGame.lastWord`, {
        word: küçükHarfliKelime,
        author: message.author.id
      });*/
      guildDataQueue.wordGame.lastWord = {
        word: küçükHarfliKelime,
        author: message.author.id
      };

      //"Aynı harfi çok sık kullandınız" uyarısı
      if ((guildDataQueue.wordGame || wordGame).history?.length) {
        const counts = {};
        const sampleArray = ((wordGame.history?.concat(guildDataQueue.wordGame?.history || []))?.splice(0, 200) || []).slice(-6).map(word => word.slice(-1));
        sampleArray.forEach(async function (x) { counts[x] = (counts[x] || 0) + 1; });

        //Son 6 kelimenin 5'i aynı harfle bitiyosa
        let sonHarf = küçükHarfliKelime.slice(-1);
        let sonHarfinKullanımOranı = (counts[sonHarf] || 0);

        if (sonHarfinKullanımOranı >= 5) {
          let yeniHarf = makeid(1, sonHarf).toLocaleLowerCase('tr-TR');
          //db.set(`guilds.${message.guild.id}.wordGame.lastWord.word`, küçükHarfliKelime + yeniHarf);
          guildDataQueue.wordGame.lastWord = {
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
