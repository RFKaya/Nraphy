const { ButtonBuilder } = require('discord.js');

module.exports = {
  name: "emojiler",
  description: "Sunucudaki emojileri listeler.",
  usage: "emojiler",
  aliases: ["emoji"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    let Emojis = [];
    let EmojisAnimated = [];
    let EmojiCount = 0;
    let Animated = 0;
    let OverallEmojis = 0;

    message.guild.emojis.cache.forEach((emoji) => {
      OverallEmojis++;
      if (emoji.animated) {
        Animated++;
        EmojisAnimated.push(emoji.toString());
      } else {
        EmojiCount++;
        Emojis.push(emoji.toString());
      }
    });

    if ((EmojiCount < 1) && (Animated < 1)) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bu Sunucuda Hiç Emoji Bulunmuyor!',
          description: `**•** Biraz emoji eklemeyi düşünebilirsiniz.`
        }
      ]
    });

    const embed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Emojiler`,
        icon_url: client.settings.icon,
      },
      title: `**»** Bu sunucuda toplam ${OverallEmojis} adet emoji bulunuyor.`,
      fields: [
        {
          name: '**»** Emoji Miktarları',
          value: `**•** Hareketsiz Emojiler: \`${EmojiCount}\`\n**•** Hareketli Emojiler: \`${Animated}\``,
        },
      ],
      description: `**•** Emojileri görüntülemek için aşağıdaki butonları kullanabilirsiniz.`
    };

    let mainPageButton = new ButtonBuilder().setLabel('Ana Sayfa').setCustomId("mainPageButton").setStyle('Primary');
    let emojisPageButton = new ButtonBuilder().setLabel('Hareketsiz Emojiler').setCustomId("emojisPageButton").setStyle('Primary');
    let animatedPageButton = new ButtonBuilder().setLabel('Hareketli Emojiler').setCustomId("animatedPageButton").setStyle('Primary');

    message.channel.send({
      embeds: [embed],
      components: [
        {
          data: { type: 1 }, components: [
            mainPageButton.setDisabled(true), emojisPageButton.setDisabled(false), animatedPageButton.setDisabled(false)
          ]
        }
      ]
    }).then(msg => {

      const filter = i => {
        return i.message.id === msg.id && i.deferUpdate() && i.user.id === message.author.id;
      };

      const calc = msg.createMessageComponentCollector({ filter, time: 180000 });

      calc.on('collect', async btn => {

        if (btn.customId === "mainPageButton") {

          msg.edit({
            embeds: [embed],
            components: [
              {
                type: 1, components: [
                  mainPageButton.setDisabled(true), emojisPageButton.setDisabled(false), animatedPageButton.setDisabled(false)
                ]
              }
            ]
          });

        } else if (btn.customId === "emojisPageButton") {

          if (Emojis.join(' ').length > 4096) {
            msg.edit({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  description: `**•** Hareketsiz emojiler, **4096** karakter limitini aştığı için gösterilemiyor.`
                }
              ],
              components: [
                {
                  type: 1, components: [
                    mainPageButton.setDisabled(false), emojisPageButton.setDisabled(true), animatedPageButton.setDisabled(false)
                  ]
                }
              ]
            });
          } else {
            msg.edit({
              embeds: [
                {
                  color: client.settings.embedColors.default,
                  author: {
                    name: `${client.user.username} • Emojiler`,
                    icon_url: client.settings.icon,
                  },
                  title: `**»** Hareketsiz Emojiler (**${EmojiCount}**)`,
                  description: `${Emojis.join(' ')}`
                }
              ],
              components: [
                {
                  type: 1, components: [
                    mainPageButton.setDisabled(false), emojisPageButton.setDisabled(true), animatedPageButton.setDisabled(false)
                  ]
                }
              ]
            });
          }

        } else if (btn.customId === "animatedPageButton") {

          if (EmojisAnimated.join(' ').length > 4096) {
            msg.edit({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  description: `**•** Hareketli emojiler, **4096** karakter limitini aştığı için gösterilemiyor.`
                }
              ],
              components: [
                {
                  type: 1, components: [
                    mainPageButton.setDisabled(false), emojisPageButton.setDisabled(false), animatedPageButton.setDisabled(true)
                  ]
                }
              ]
            });
          } else {
            msg.edit({
              embeds: [
                {
                  color: client.settings.embedColors.default,
                  author: {
                    name: `${client.user.username} • Emojiler`,
                    icon_url: client.settings.icon,
                  },
                  title: `**»** Hareketli Emojiler (**${Animated}**)`,
                  description: `${EmojisAnimated.join(' ')}`
                }
              ],
              components: [
                {
                  type: 1, components: [
                    mainPageButton.setDisabled(false), emojisPageButton.setDisabled(false), animatedPageButton.setDisabled(true)
                  ]
                }
              ]
            });
          }

        }
      });

      calc.on('end', collected => {
        return msg.edit({
          components: []
        });
      });

    });

    /*if (EmojiCount > 0) {

      if (Emojis.length > 1024) {
        Embed.addField(`**»** Hareketsiz Emojiler (${EmojiCount})`, `**•** 1024 karakter limitini aştığı için gösterilemiyor.`)
      } else {
        Embed.addField(`**»** Hareketsiz Emojiler (${EmojiCount})`, `${Emojis}`)
      }

    }

    if (Animated > 0) {

      if (EmojisAnimated.length > 1024) {
        Embed.addField(`**»** Hareketli Emojiler (${EmojiCount})`, `**•** 1024 karakter limitini aştığı için gösterilemiyor.`)
      } else {
        Embed.addField(`**»** Hareketli Emojiler (${Animated})`, `${EmojisAnimated}`)
      }

    }

    message.channel.send({ embeds: [Embed] });*/

  }
};