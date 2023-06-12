const Discord = require('discord.js');
const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "kelime-oyunu",
    description: "💎 Kelime oyununu ayarlamanıza yarar.",
    options: [
      {
        name: "bilgi",
        description: "Kelime oyunu hakkında tüm bilgileri sağlar.",
        type: 1,
        options: []
      },
      {
        name: "ayarla",
        description: "Kelime oyunu sistemini aktif eder.",
        type: 1,
        options: [
          {
            name: "kanal",
            description: "Kelime oyunu kanalını seç.",
            type: 7,
            required: true
          },
        ]
      },
      /*{
        name: "sıralama",
        description: "Kelime oyunu sıralaması",
        type: 1,
        options: []
      },*/
      {
        name: "ayarlar",
        description: "Kelime oyununun ayarlarını değiştirir.",
        type: 2,
        options: [
          {
            name: "üst-üste-yazma",
            description: "Oyuncuların üst üste kelime türetmesine izin verir.",
            type: 1,
            options: [
              {
                name: "işlem",
                description: "Bir oyuncu üst üste kelimeler yazabilsin mi?",
                choices: [
                  { name: "Aç", value: "ac" },
                  { name: "Kapat", value: "kapat" }
                ],
                type: 3,
                required: true
              },
            ]
          },
          /*{
            name: "geçmiş-uzunluğu",
            description: "dassda", //Düzenlenecek
            type: 1,
            options: [
              {
                name: "uzunluk",
                description: "dasdsa",  //Düzenlenecek
                type: 4,
                required: true
              },
            ],
          },*/
        ]
      },
      {
        name: "sıfırla",
        description: "Kelime oyununun seçilen değerlerini sıfırlar.",
        type: 2,
        options: [
          /*{
            name: "ayarlar",
            description: "asdsda", //Düzenlenecek
            type: 1,
            options: []
          },*/
          {
            name: "istatistikler",
            description: "Sıralama, toplam kelime, en uzun kelime gibi değerleri sıfırlar.",
            type: 1,
            options: []
          },
          /*{
             name: "kelime-geçmişi",
             description: "asdsda", //Düzenlenecek
             type: 1,
             options: []
           },*/
        ]
      },
      {
        name: "kapat",
        description: "Kelime oyununu kapatır. Ancak ayarlar ve istatistikler sıfırlanmaz.",
        type: 1,
        options: []
      },
    ]
  },
  interactionOnly: true,
  aliases: ["kelimeoyunu", "wordgame", "word-game", "kelime"],
  category: "Games",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageMessages", "AddReactions"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const getSubcommand = interaction.options.getSubcommandGroup(false);
    const getCommand = interaction.options.getSubcommand();

    const wordGame = data.guild.wordGame;

    if (getCommand == "bilgi") {

      const destekSunucusuButon = new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link');

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Kelime Oyunu Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Kelime Oyunu Nasıl Oynanır?',
                value: `**•** Kelime oyunu için bir kanal ayarlanır, (o kanal sadece kelime oyunu için kullanılır) herhangi bir sözcük ile başlangıç yapılır, o sözcüğün son harfiyle yeni kelimeler türetilmeye çalışılır. Son kelimenin son harfiyle yeni bir kelime türetilir. Oyun bu şekilde devam eder. Aşağıdaki resimde örnek bulunuyor.`,
              },
              {
                name: '**»** Kelime Oyunu Sıralamasına Nasıl Ulaşırım?',
                value: `**•** \`/sıralama\` komutunu çalıştırıp, mesajın altındaki butonlardan kelime oyunu sıralamasını seçerek sıralamaya ulaşabilirsiniz.`,
              },
              {
                name: '**»** Puan Nasıl Kazanılır?',
                value: `**•** Kelimeleriniz ne kadar uzun olursa o kadar çok puan kazanırsınız. Ek olarak yazdığınız kelime miktarı da puanlarınızı arttırmaktadır.`,
              },
              {
                name: '**»** Kelime Oyunu Kanalına Oyun Harici Bir Mesaj Nasıl Yazılır?',
                value: `**•** Mesajınızın başında **">"** veya **"!"** olması yeterlidir.`,
              },
              {
                name: '**»** Kelime Oyunu Nasıl Ayarlanır?',
                value: `**•** \`/kelime-oyunu Ayarla\` şeklinde kelime oyununu ayarlayabilirsiniz. Kanal değişimlerinde ayarlar ve istatistikler korunmaktadır.`,
              },
              {
                name: '**»** Üst Üste Yazmayı Nasıl Açarım/Kapatırım?',
                value: `**•** \`/kelime-oyunu Ayarlar üst-üste-yazma\` yazarak bu ayarı değiştirebilirsiniz. Açıldığında bir üye üst üste istediği kadar kelime yazabilecektir.`,
              },
              /*{
                name: '**»** Kelime Geçmiş Uzunluğunu Nasıl Kapatırım/Büyütürüm?',
                value: `**•** \`/kelime-oyunu Ayarlar kelime-geçmişi\` yazarak bu ayarı değiştirebilirsiniz. Kelime geçmişi özelliği, aynı kelimenin kaç kelime sonra tekrar yazılabilmesini belirler. Kapatmak için 0 yazabilirsiniz.`,
              },*/
              {
                name: '**»** Kelime Oyunu Değerleri (İstatistikler vb.) Nasıl Sıfırlanır?',
                value: `**•** \`/kelime-oyunu Sıfırla İstatistikler\` şeklinde kelime oyunununun sıfırlamak istediğiniz değerini sıfırlayabilirsiniz.`,
              },
              {
                name: '**»** Kelime Oyunu Nasıl Kapatılır?',
                value: `**•** \`/kelime-oyunu Kapat\` şeklinde kelime oyununu kapatabilirsiniz. Ayarlarınız ve istatistikleriniz korunacaktır.`,
              },
              {
                name: '**»** Mevcut Ayarları Nasıl Görüntülerim?',
                value: `**•** \`/ayarlar\` yazıp kelime oyunu sayfasından tüm ayarları görüntüleyebilirsiniz.`,
              },
              {
                name: '**»** Ekstra Bilgi',
                value: `**•** Kelime oyununun daha adil bir oyun olabilmesi adına bazı korumalar ekledik. Nraphy, kelime oyununun sabote edildiğini fark ederse ilgili oyuncular hakkında ya da oyun üzerinde bazı aksiyonlar alabilir.`,
              },
              {
                name: '**»** Tüm Bunlara Rağmen Ben Anlamadım Arkadaş!',
                value: `**•** Aşağıdaki butondan gel [destek sunucumuza](https://discord.gg/QvaDHvuYVm), yardımcı olalım. Aklına takılan nedir?`
              },
            ],
            image: {
              url: 'https://cdn.discordapp.com/attachments/801418986809589771/891592954907623424/unknown.png',
            },
          },
        ],
        components: [
          {
            type: 1, components: [destekSunucusuButon]
          },
        ]
      });

    } else if (getCommand == "ayarla") {

      const channel = interaction.options.getChannel("kanal");

      const { channelChecker } = require("../../modules/Functions");
      if (await channelChecker(interaction, channel, ["ViewChannel", "SendMessages", "EmbedLinks"])) return;

      //Kanal Zaten Varsa (Kanal Değişikliği)
      if (wordGame?.channel && interaction.guild.channels.cache.has(wordGame.channel)) {

        //Kelime Oyunu Zaten Aynı Kanalda
        if (wordGame.channel == channel.id) {
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Kelime Oyunu Kanalı Zaten Aynı!',
                description: `**•** Kapatmak için \`/kelime-oyunu Kapat\` yazabilirsin.`
              }
            ]
          });
        }

        //Kelime Oyunu Kanalı Değiştirildi
        else {
          //db.set(`guilds.${interaction.guild.id}.wordGame.channel`, channel.id);
          data.guild.wordGame.channel = channel.id;
          data.guild.wordGame.setupChannel = interaction.channel.id;
          data.guild.markModified('wordGame');
          await data.guild.save();

          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: '**»** Kelime Oyunu Kanalı Değiştirildi!',
                description: `**•** Kanal ${channel.toString()} olarak değiştirildi.`
              }
            ]
          });
        }

      }

      /*db.set(`guilds.${interaction.guild.id}.wordGame.channel`, channel.id);
      db.set(`guilds.${interaction.guild.id}.wordGame.lastWord`, "n");
      db.set(`guilds.${interaction.guild.id}.wordGame.setupInChannel`, interaction.channel.id);*/
      data.guild.wordGame.channel = channel.id;
      data.guild.wordGame.setupChannel = interaction.channel.id;
      data.guild.markModified('wordGame');
      await data.guild.save();

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Kelime Oyunu Başarıyla Ayarlandı!',
            author: {
              name: `${client.user.username} • Kelime Oyunu`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Kanal',
                value: `**•** ${channel}`,
                inline: true,
              },
              {
                name: '**»** Başlangıç Harfi',
                value: `**•** \`${data.guild.wordGame?.lastWord.word?.slice(-1).toLocaleUpperCase('tr-TR') || "N"}\``,
                inline: true,
              },
            ]
          }
        ]
      });

    } /*else if (getSubcommand == "sıralama") {

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Tasındık Abicim!',
            description: `**•** \`/sıralama\` komutuna tasındık, uğrayıp cayımızı icebilirsin :)`
          }
        ]
      });

    }*/ else if (getSubcommand == "ayarlar") {

      if (getCommand == "üst-üste-yazma") {

        const operation = interaction.options.getString("işlem");

        if (operation == "ac") {

          //db.set(`guilds.${interaction.guild.id}.wordGame.writeMore`, true);
          data.guild.wordGame.writeMore = true;
          data.guild.markModified('wordGame');
          await data.guild.save();

          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: '**»** Birden Fazla Kez Yazma Açıldı!',
                description: `**•** Artık bir oyuncu tekrar yazmak için araya başkasının girmesini beklemeyecek.`
              }
            ]
          });

        } else if (operation == "kapat") {

          //db.set(`guilds.${interaction.guild.id}.wordGame.writeMore`, false);
          data.guild.wordGame.writeMore = false;
          data.guild.markModified('wordGame');
          await data.guild.save();

          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.green,
                title: '**»** Birden Fazla Kez Yazma Kapatıldı!',
                description: `**•** Artık bir oyuncu üst üste kelimeler türetemeyecek.`
              }
            ]
          });

        }

      } else if (getCommand == "geçmiş-uzunluğu") {

      }

    } else if (getSubcommand == "sıfırla") {

      if (getCommand == "istatistikler") {

        if (!wordGame?.stats)
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** İstatistiklerin Sıfırlanması İçin Yeterli Veri Yok!',
                description: `**•** Azıcık veri kas, canını yerim bak.`
              }
            ],
            components: []
          });

        const { buttonConfirmation } = require("../../modules/Functions");
        if (!await buttonConfirmation(interaction, [
          {
            color: client.settings.embedColors.default,
            title: '**»** Kelime Oyunu İstatistiklerinin Sıfırlanmasını Onaylıyor musun?',
            description:
              `**•** Sıralama, ortalama harf uzunluğu, toplam kelime, en uzun kelime ve kelime geçmişi sıfırlanacak.\n` +
              `**•** Silinen bilgilerin bir kopyası TXT dosyası olarak verilecek.\n`
          }
        ])) return interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Sıfırlama İşlemini İptal Ettim!',
              description: `**•** Buraya ne yazsam bilemedim. İptalin ne açıklaması olabilir ki?`
            }
          ],
          components: []
        }).catch(error => { });

        await interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.default,
              title: '**»** Kelime Oyunu İstatistikleri Sıfırlanıyor...',
              description: `**•** Dosyanın oluşturulması işlemi biraz zaman alabilir.`
            }
          ],
          components: []
        });

        //Sıralama
        let wordGameLeaderboard = [];
        if (wordGame.stats)
          for await (let user of Object.keys(wordGame.stats || {})) {
            let statUser = wordGame.stats[user];
            wordGameLeaderboard.push({ ID: user, wordLengths: statUser.wordLength, words: statUser.wordCount, point: ((statUser.wordLength ? statUser.wordCount : 0) / 2 + statUser.wordCount).toFixed(0) });
          }
        wordGameLeaderboard.sort((a, b) => b.point - a.point).splice(100);
        let TXT_Leaderboard = wordGameLeaderboard
          .map(data => `${wordGameLeaderboard.indexOf(data) + 1}# - ${interaction.guild.members.cache.get(data.ID)?.user.tag || data.ID} • ${data.point} Puan - ${data.words} Kelime`);

        //İstatistikler
        let wordGameStats = { totalWordLengths: 0, totalWords: 0 };
        if (wordGame.stats) for await (let user of Object.keys(wordGame.stats || {})) {
          let statUser = await wordGame.stats[user];
          wordGameStats = {
            totalWordLengths: wordGameStats.totalWordLengths + (statUser.wordLength ? statUser.wordLength : 0),
            totalWords: wordGameStats.totalWords + statUser.wordCount
          };
        }
        let longestWordUser;
        if (wordGame.longestWord) await client.users.fetch(wordGame.longestWord.author).then(async user => { longestWordUser = user; });

        //TXT Oluşturma
        let attachment = new Discord.AttachmentBuilder(
          Buffer.from(
            `Ortalama Harf Uzunluğu: ${wordGameStats.totalWordLengths > 0 ? `${(wordGameStats.totalWordLengths / wordGameStats.totalWords).toFixed(2)} Harf` : "Harf uzunluğu ortalaması için yeterli veri yok."}\n` +
            `Toplam Kelime: ${wordGameStats.totalWords ? `${wordGameStats.totalWords} Kelime` : "Hiç kelime verisi yok."}\n` +
            `En Uzun Kelime: ${wordGame.longestWord ?
              `${client.capitalizeFirstLetter(wordGame.longestWord.word, "tr")} (${wordGame.longestWord.word.length} Harf) (${longestWordUser.tag} tarafından)`
              : "Veri yok"}\n\n` +

            `${TXT_Leaderboard.join('\n')}`, 'utf-8'),
          { name: "Nraphy-KelimeOyunuSiralamasi.txt" });

        /*db.delete(`guilds.${interaction.guild.id}.wordGame.stats`);
        db.delete(`guilds.${interaction.guild.id}.wordGame.longestWord`);
        db.delete(`guilds.${interaction.guild.id}.wordGame.history`);*/
        data.guild.wordGame.stats = undefined;
        data.guild.wordGame.longestWord = undefined;
        data.guild.wordGame.history = undefined;
        data.guild.markModified('wordGame');
        await data.guild.save();

        interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Kelime Oyunu İstatistikleri Başarıyla Sıfırlandı!',
              description: `**•** Eğer oyun açık ise mevcut ayarlarla oynanmaya devam edilecek.`
            }
          ],
          files: [attachment]
        });

      } else if (getCommand == "kelime-geçmişi") {

      }

    } else if (getCommand == "kapat") {

      if (!wordGame?.channel) {
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Kelime Oyunu Zaten Ayarlı Değil!',
              description: `**•** Olmayan bir oyunu neden kapatmak istiyorsun ki?`
            }
          ]
        });

      } else {

        //db.delete(`guilds.${interaction.guild.id}.wordGame.channel`);
        data.guild.wordGame.channel = undefined;
        data.guild.markModified('wordGame');
        await data.guild.save();

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Kelime Oyunu Başarıyla Kapatıldı!',
              description:
                `**•** Tekrar açtığınızda mevcut ayarlarınız ve istatistiklerinizle devam edebilirsiniz.\n` +
                `**•** İstatistikleri de sıfırlamak isterseniz: \`/kelime-oyunu Sıfırla İstatistikler\``
            }
          ]
        });
      }

    }

  }
};