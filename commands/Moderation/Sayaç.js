const db = require("quick.db");

module.exports = {
  name: "sayaç",
  description: "Sayaç ayarlamanıza yarar.",
  usage: "sayaç <Sıfırla/Sayı> #Kanal",
  aliases: ["sayac", "sayaç-ayarla", "sayaçayarla"],
  category: "Moderation",
  memberPermissions: ["Administrator"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Sayaç Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Sayaç Kanalı Ne İşe Yarar?',
                value: `**•** Bir hedef ve bir kanal belirlersiniz. Sunucuya bir üye katıldığında, belirttiğiniz hedefe kaç üye kaldığıyla birlikte katılan üyenin bilgilerini gönderir.`,
              },
              {
                name: '**»** Davet Sistemiyle Uyumu!',
                value: `**•** Eğer davet kanalıyla sayaç kanalını aynı yaparsanız davet sistemiyle tam uyumlu olarak çalışıp tek mesaj içerisinde iki sistemin bilgilerini de verecektir.`,
              },
              {
                name: '**»** Sayaç Kanalı Nasıl Ayarlanır?',
                value: `**•** \`${data.prefix}sayaç <#Kanal> <Hedef>\` yazarak sayaç sistemini açabilirsiniz.`,
              },
              {
                name: '**»** Sayaç Kanalı Nasıl Sıfırlanır?',
                value: `**•** \`${data.prefix}sayaç Sıfırla\` yazarak sayaç sistemini kapatabilirsiniz.`,
              },
              {
                name: '**»** Ek Bilgiler',
                value:
                  `**•** Nraphy'nin, ayarladığınız sayaç kanalını görebilme ve mesaj yazma yetkisi olduğuna emin olun. Aksi hâlde sayaç sistemi otomatik olarak sıfırlanacaktır.`
              },
            ],
          }
        ]
      });
    }

    let target = Number(args[1]);

    if (args[0].toLocaleLowerCase('tr-TR') === "kapat" || args[0].toLocaleLowerCase('tr-TR') === "sıfırla") {

      if (db.fetch(`guilds.${message.guild.id}.memberCounter`)) {

        db.delete(`guilds.${message.guild.id}.memberCounter`);

        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Sayaç Sistemi Başarıyla Sıfırlandı!',
              description: `**•** Tekrar ayarlamak için \`${data.prefix}sayaç #Kanal <Hedef>\` yazabilirsiniz.`
            }
          ]
        })

      } else {

        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Sayaç Sistemi Zaten Kapalı!',
              description: `**•** Kapalı olan bir sistemi neden kapatmak istiyorsun ki?`
            }
          ]
        })
        
      }
    }

    var mentionedChannel = message.mentions.channels.first();

    if (!mentionedChannel) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Geçerli Bir Kanal Belirtmelisin!',
          description: `**•** Örnek kullanım: \`${data.prefix}sayaç #gelen-giden\``
        }
      ]
    })

    if (!message.guild.channels.cache.has(mentionedChannel.id)) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bu Sunucuda Olmayan Bir Kanalı Etiketleyemezsin!',
          description: `**•** Yapma işte. Yapma. Hoşlanmıyorum diyorum bu şakalardan. Hıh.`
        }
      ]
    })

    if (!mentionedChannel.permissionsFor(message.guild.members.me).has("ViewChannel")) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Etiketlediğin Kanalı Görme Yetkim Bulunmuyor!',
          description: `**•** İzinlerimi kontrol et ve tekrar dene.`
        }
      ]
    })

    if (!mentionedChannel.permissionsFor(message.guild.members.me).has("SendMessages")) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Etiketlediğin Kanalda **Mesaj Gönder** Yetkim Bulunmuyor!',
          description: `**•** İzinlerimi kontrol et ve tekrar dene.`
        }
      ]
    })

    if (!mentionedChannel.permissionsFor(message.guild.members.me).has("EmbedLinks")) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Etiketlediğin Kanalda **Bağlantı Yerleştir** Yetkim Bulunmuyor!',
          description: `**•** İzinlerimi kontrol et ve tekrar dene.`
        }
      ]
    })

    if (!args[1]) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bir Hedef Belirtmelisin!',
          description: `**•** Örnek kullanım: \`${data.prefix}sayaç #Sayaç <Hedef>\``
        }
      ]
    })

    if (isNaN(args[1])) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Sunucudaki Üye Sayısından Fazla Hedef Belirtmelisin!',
          description: `**•** Örnek kullanım: \`${data.prefix}sayaç #Sayaç 300\``
        }
      ]
    })

    if (target <= message.guild.memberCount) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Belirttiğin Hedef Sadece Sayı İçermeli!',
          description: `**•** Sunucuda **${message.guild.memberCount}** üye bulunuyor.`
        }
      ]
    })

    if (db.fetch(`guilds.${message.guild.id}.memberCounter`)) {

      if (db.fetch(`guilds.${message.guild.id}.memberCounter.target`) == target && db.fetch(`guilds.${message.guild.id}.memberCounter.channel`) == mentionedChannel.id) {

        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Sayaç Kanalı ve Hedefi Zaten Aynı!',
              description: `**•** Sıfırlamak için \`${data.prefix}sayaç Sıfırla\` yazabilirsin.`
            }
          ]
        })

      } else if (db.fetch(`guilds.${message.guild.id}.memberCounter.target`) == target) {

        db.set(`guilds.${message.guild.id}.memberCounter.channel`, mentionedChannel.id)
        db.set(`guilds.${message.guild.id}.memberCounter.setupInChannel`, message.channel.id)

        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Sayaç Kanalı Değiştirildi!',
              description: `**•** Kanal ${mentionedChannel} olarak değiştirildi.`
            }
          ]
        })

      } else if (db.fetch(`guilds.${message.guild.id}.memberCounter.channel`) == mentionedChannel.id) {

        db.set(`guilds.${message.guild.id}.memberCounter.target`, target)
        db.set(`guilds.${message.guild.id}.memberCounter.setupInChannel`, message.channel.id)

        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Sayaç Hedefi Değiştirildi!',
              description: `**•** Hedef **${target}** olarak değiştirildi.`
            }
          ]
        })

      }
    }

    db.set(`guilds.${message.guild.id}.memberCounter`, { target: target, channel: mentionedChannel.id, setupInChannel: message.channel.id });

    //db.set(`Sayaç.${message.guild.id}`, hedef);
    //db.set(`Sayaç-Kanal.${message.guild.id}`, mentionedChannel.id);

    message.reply({
      embeds: [
        {
          color: client.settings.embedColors.green,
          title: '**»** Sayaç Başarıyla Ayarlandı!',
          author: {
            name: `${client.user.username} • Sayaç Sistemi`,
            icon_url: client.settings.icon,
          },
          fields: [
            {
              name: '**»** Kanal',
              value: `**•** ${mentionedChannel}`,
              inline: true,
            },
            {
              name: '**»** Hedef',
              value: `**•** ${target}`,
              inline: true,
            },
          ],
        }
      ]
    });

  }
};