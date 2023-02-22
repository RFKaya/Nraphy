const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "isim-temizleme",
  description: "Denemesi beleş.",
  usage: "isim-temizleme",
  aliases: ["isimtemizleme", "isimtemizle", "isim-temizle"],
  category: "Moderation",
  memberPermissions: ["Administrator"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageNicknames"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    if (!args[0])
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • İsim Temizleme Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** İsim Temizleme Sistemi Ne İşe Yarar?',
                value: `**•** Sunucuya katılan üyelerin isminde eğer harf veya sayı haricinde etiketlenemeyen karakterler varsa kullanıcının adını temizler ve etiketlenebilir sayılar olarak değiştirir. Aşağıdaki resimde bir örnek bulunuyor.`,
              },
              {
                name: '**»** İsim Temizleme Sistemi Nasıl Açılır?',
                value: `**•** \`${data.prefix}isim-temizleme Aç\` yazarak isim temizleme sistemini açabilirsiniz.`,
              },
              {
                name: '**»** İsim Temizleme Sistemi Nasıl Kapatılır?',
                value: `**•** \`${data.prefix}isim-temizleme Kapat\` yazarak isim temizleme sistemini kapatabilirsiniz.`,
              },
            ],
            image: {
              url: 'https://cdn.discordapp.com/attachments/614117053699457053/777476437107933204/unknown.png',
            },
          }
        ]
      });

    let isimTemizleme = await db.fetch(`isim-temizle.${message.guild.id}`);

    if (args[0].toLocaleLowerCase('tr-TR') === "aç" || args[0].toLocaleLowerCase('tr-TR') === "ac") {

      if (!isimTemizleme) {
        db.set(`isim-temizle.${message.guild.id}`, true);
        message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** İsim Temizleme Sistemi Başarıyla Açıldı!',
              description: `**•** Kapatmak istersen \`${data.prefix}isim-temizleme Kapat\` yazabilirsin.`
            }
          ]
        })

      } else {
        message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** İsim Temizleme Sistemi Zaten Açık!',
              description: `**•** Kapatmak için \`${data.prefix}isim-temizleme Kapat\` yazabilirsin.`
            }
          ]
        })
      }
    } else if (args[0].toLocaleLowerCase('tr-TR') === "kapat" || args[0].toLocaleLowerCase('tr-TR') === "kapa") {

      if (!isimTemizleme)
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** İsim Temizleme Sistemi Zaten Kapalı!',
              description: `**•** Açmak için \`${data.prefix}isim-temizleme Aç\` yazabilirsin.`
            }
          ]
        })

      db.delete(`isim-temizle.${message.guild.id}`);
      message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** İsim Temizleme Sistemi Başarıyla Kapatıldı!',
            description: `**•** Açmak istersen \`${data.prefix}isim-temizleme Aç\` yazabilirsin.`
          }
        ]
      })
    } else {

      message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Eksik veya Hatalı Bir Giriş Yaptın!',
            fields: [
              {
                name: '**»** İsim Temizleme Sistemini Açmak İçin',
                value: `**•** \`${data.prefix}isim-temizleme Aç\``,
              },
              {
                name: '**»** İsim Temizleme Sistemini Kapatmak İçin',
                value: `**•** \`${data.prefix}isim-temizleme Kapat\``,
              },
            ],
          }
        ]
      });

    }
  }
};