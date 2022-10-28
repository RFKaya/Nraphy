const Discord = require('discord.js');
const { delay, randomRange, verify } = require('../../utils/Util.js');
const { MessageActionRow, ButtonBuilder } = require('discord.js');
const words = require('../../utils/Words.json');

module.exports = {
  name: "kelime-yarışması",
  description: "Rastgele verilen kelimeyi ilk yazan kazanır.",
  usage: "kelime-yarışması <@Kullanıcı#1234>",
  aliases: ['yazı-yarışı', 'ilk-yazan-kazanır', 'kelimeyarışması', 'yazan-kazanır', 'kelimeyarışı', 'kelime-yarışı', 'ky', "yazankazanır", "yazan-kazanır"],
  category: "Games",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    let opponent = message.mentions.users.first()

    if (!opponent) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Oynamak İstediğin Kullanıcıyı Etiketlemelisin!',
          description: `**•** Örnek kullanım: \`${data.prefix}kelime-yarışması <@Üye>\``
        }
      ]
    });

    if (opponent.id == client.user.id) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Benimle Oynayamazsın!',
          description: `**•** Çünkü henüz benim seviyemde değilsin 😎`
        }
      ]
    });

    if (opponent.bot) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Botlarla Oynayamazsın!',
          description: `**•** Oynayabileceklerini sandın mı ki zaten?`
        }
      ]
    });

    if (opponent.id === message.author.id) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Kendinle Oynayamazsın!',
          description: `**•** Sen kendinle oynamaya çalışacak kadar yalnız mıydın?`
        }
      ]
    });

    if (client.gamesPlaying.has(message.channel.id)) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bu Kanalda Zaten Devam Eden Bir Oyun Var!',
          description: `**•** Farklı bir kanalda dene veya sıranı bekle.`
        }
      ]
    });

    client.gamesPlaying.set(message.channel.id, this.name)
    try {

      let confirmButton = new ButtonBuilder().setLabel('Kabul Et').setCustomId("confirmButton").setStyle('Success')
      let denyButton = new ButtonBuilder().setLabel('İptal Et').setCustomId("denyButton").setStyle('Danger')

      await message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.default,
            title: `**»** ${opponent.username} oyunu kabul ediyor musun?`,
            description: `**•** Butonları kullanarak cevaplayabilirsin.`
          }
        ],
        components: [
          {
            type: 1, components: [
              confirmButton, denyButton
            ]
          }
        ]
      }).then(msg => {

        const filter = i => {
          i.deferUpdate();
          return i.user.id === opponent.id;
        };

        msg.awaitMessageComponent({ filter, time: 25000 })
          .then(async btn => {

            btn.deferUpdate()

            if (btn.customId === "confirmButton") {

              await msg.edit({
                embeds: [
                  {
                    color: client.settings.embedColors.default,
                    title: '**»** Hazırlanın!',
                    description: `**•** 3 saniye sonra kelime geliyor!`
                  }
                ],
                components: []
              })

              const word = words[Math.floor(Math.random() * words.length)];

              await setTimeout(() => {
                message.channel.send({
                  embeds: [
                    {
                      color: client.settings.embedColors.default,
                      title: '**»** Hemen `' + word.toLocaleLowerCase('tr-TR') + '` kelimesini yaz!',
                      //description: `**•** Farklı bir kanalda dene veya sıranı bekle.`
                    }
                  ]
                });
              }, 3000)
              //await msg.channel.send(`_Kelimeyi tamamen küçük harfle yazınız._`);
              const filter = res => [opponent.id, message.author.id].includes(res.author.id) && res.content.toLocaleLowerCase('tr-TR') === word;
              const winner = await message.channel.awaitMessages({ filter, max: 1, time: 10000 });
              client.gamesPlaying.delete(message.channel.id)
              if (!winner.size) return message.channel.send({
                embeds: [
                  {
                    color: client.settings.embedColors.red,
                    title: '**»** Kimse Kazanamadı!',
                    description: `**•** Dostluk kazanmış olabilir. Belki o da kaybetmiştir.`
                  }
                ]
              });
              return message.channel.send({
                embeds: [
                  {
                    color: client.settings.embedColors.green,
                    title: `**»** Tebrikler ${winner.first().author.username}! Kazandın! 🏆`,
                    //description: `**•** Farklı bir kanalda dene veya sıranı bekle.`
                  }
                ]
              });

            } else if (btn.customId === "denyButton") {

              client.gamesPlaying.delete(message.channel.id)

              return msg.edit({
                embeds: [
                  {
                    color: client.settings.embedColors.red,
                    title: '**»** Meydan Okuma Reddedildi!',
                    description: `**•** Üzgünüm, istersen [Destek Sunucumuza](https://discord.gg/VppTU9h) katılıp orada birilerini bulabilirsin.`
                  }
                ],
                components: []
              });

            }
          }).catch(err => {

            client.gamesPlaying.delete(message.channel.id)

            msg.edit({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: '**»** Meydan Okuma Kabul Edilmedi!',
                  description: `**•** Üzgünüm, istersen [Destek Sunucumuza](https://discord.gg/VppTU9h) katılıp orada birilerini bulabilirsin.`
                }
              ],
              components: []
            });
          });
      })
    } catch (err) {
      client.gamesPlaying.delete(message.channel.id)
      throw err;
    }

  }
};