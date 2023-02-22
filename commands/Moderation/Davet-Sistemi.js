const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "davet-sistemi",
  description: "Kimin, kimi davet ettiğini gösteren sistem.",
  usage: "davet-sistemi",
  aliases: ["gelengiden", 'gelen-giden', 'davetsistemi'],
  category: "Moderation",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageGuild"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    let ar = [
      "sıfırla",
      "kapat"
    ];

    if (!args[0] || !ar.includes(args[0].toLocaleLowerCase('tr-TR')) && !message.mentions.channels.first())
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Davet Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Davet Kanalı Ne İşe Yarar?',
                value: `**•** Sunucuya bir üye katıldığında; ayarladığınız kanala, o üyeyi kimin davet ettiğini bildirir.`,
              },
              {
                name: '**»** Davet Sıralamasına Nasıl Ulaşırım?',
                value: `**•** \`/sıralama\` komutunu çalıştırıp, mesajın altındaki butonlardan davet sıralamasını seçerek sıralamaya ulaşabilirsiniz.`,
              },
              {
                name: '**»** Sayaç Sistemiyle Uyumu!',
                value: `**•** Eğer sayaç kanalıyla davet kanalını aynı yaparsanız sayaç sistemiyle tam uyumlu olarak çalışıp tek mesaj içerisinde iki sistemin bilgilerini de verecektir.`,
              },
              {
                name: '**»** Davet Kanalı Nasıl Ayarlanır?',
                value: `**•** \`${data.prefix}davet-sistemi #Kanal\` yazarak davet sistemini açabilirsiniz.`,
              },
              {
                name: '**»** Davet Kanalı Nasıl Sıfırlanır?',
                value: `**•** \`${data.prefix}davet-sistemi Sıfırla\` yazarak davet sistemini kapatabilirsiniz.`,
              },
              {
                name: '**»** Nraphy, Hangi İzinlere İhtiyaç Duyuyor?',
                value: `**•** Nraphy'e **Sunucuyu Yönet** yetkisini, ayarlayacağınız kanala ise **Mesaj Gönder** yetkisini vermeniz yeterli olacaktır.`,
              },
              {
                name: '**»** Ek Bilgiler',
                value:
                  `**•** Nraphy'nin, ayarladığınız davet kanalını görebilme ve mesaj yazma yetkisi olduğuna emin olun. Aksi hâlde davet sistemi otomatik olarak sıfırlanacaktır.\n` +
                  `**•** Sadece sunucuya katılan üyeler için çalışır. Sunucudan ayrılan bir üye olduğunda bildirmez.`
              },
            ],
            image: {
              url: 'https://media.discordapp.net/attachments/801418986809589771/873909005834129479/unknown.png',
            },
          }
        ]
      });

    /*if (args[0] === "davet-eden" || args[0] === "daveteden") {
      if (!args[1]) return message.channel.send(new Discord.EmbedBuilder()
        .setColor(client.settings.embedColors.default)
        .setDescription('**»** Birisini etiketlemelisin. `n!davet davet-eden @Enes3078`'));
  
      let mention = message.mentions.users.first();
    if(!mention) return message.channel.send(new Discord.EmbedBuilder()
        .setColor(client.settings.embedColors.default)
        .setDescription('**»** Etiketlediğin kişiyi bulamıyorum.'));
    const asd = await db.fetch(`seni_kim_davet_etti?.${mention.id}.${message.guild.id}`)
    if(!asd) return message.channel.send(new Discord.EmbedBuilder()
        .setColor(client.settings.embedColors.default)
        .setDescription('**»** Davet eden kişiyi bulamadım.'));
  
      const embed = new Discord.EmbedBuilder()
        //.setAuthor(client.user.username, client.user.avatarURL)
        .setAuthor(`${mention.tag}`, mention.avatarURL({dynamic: true}))
        .setDescription(`${client.users.get(asd)} tarafından davet edildi.`)
        .setColor(client.settings.embedColors.default)
        //.setTimestamp()
        //.setFooter(message.author.username + ` tarafından istendi.`, message.author.avatarURL)
      message.channel.send(embed);
    }*/

    var inviteManager = await db.fetch(`guilds.${message.guild.id}.inviteManager`)
    var mentionedChannel = message.mentions.channels.first();

    if (args[0].toLocaleLowerCase('tr-TR') == "sıfırla" || args[0].toLocaleLowerCase('tr-TR') == "kapat") {

      if (!inviteManager) {
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Davet Sistemi Zaten Kapalı!',
              description: `**•** Açmak için \`${data.prefix}otomatik-cevap #Kanal\` yazabilirsin.`
            }
          ]
        })

      } else {

        db.delete(`guilds.${message.guild.id}.inviteManager.channel`);

        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Davet Sistemi Başarıyla Kapatıldı!',
              description: `**•** Tekrar açmak istersen \`${data.prefix}otomatik-cevap #Kanal\` yazabilirsin.`
            }
          ]
        })
      }
    }

    if (!mentionedChannel) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Geçerli Bir Kanal Belirtmelisin!',
          description: `**•** Örnek kullanım: \`${data.prefix}davet-sistemi #gelen-giden\``
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

    if (inviteManager) {
      if (inviteManager.channel == mentionedChannel.id) {
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Davet Kanalı Zaten Aynı!',
              description: `**•** Sıfırlamak için \`${data.prefix}davet-sistemi Sıfırla\` yazabilirsin.`
            }
          ]
        })
        
      } else {

        db.set(`guilds.${message.guild.id}.inviteManager`, { channel: mentionedChannel.id, setupInChannel: message.channel.id })

        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Davet Kanalı Değiştirildi!',
              description: `**•** Kanal, ${mentionedChannel} olarak değiştirildi.`
            }
          ]
        })

      }
    }

    db.set(`guilds.${message.guild.id}.inviteManager`, { channel: mentionedChannel.id, setupInChannel: message.channel.id })

    message.reply({
      embeds: [
        {
          color: client.settings.embedColors.green,
          title: '**»** Davet Sistemi Başarıyla Ayarlandı!',
          author: {
            name: `${client.user.username} • Davet Sistemi`,
            icon_url: client.settings.icon,
          },
          fields: [
            {
              name: '**»** Kanal',
              value: `**•** ${mentionedChannel}`,
            },
          ],
        }
      ]
    });

  }
};