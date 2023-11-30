const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "emojiler",
    description: "Sunucudaki tüm emojileri listeler.",
  },
  aliases: ["emoji"],
  category: "General",
  cooldown: 10000,

  async execute(client, interaction, data, args) {

    const emojisNormal = interaction.guild.emojis.cache.filter(emoji => !emoji.animated);
    const emojisAnimated = interaction.guild.emojis.cache.filter(emoji => emoji.animated);

    if (!emojisNormal.size && !emojisAnimated.size)
      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bu Sunucuda Hiç Emoji Bulunmuyor!',
            description: `**•** Biraz emoji eklemeyi düşünebilirsin.`
          }
        ]
      });

    const embed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Emojiler`,
        icon_url: client.settings.icon,
      },
      title: `**»** Bu sunucuda toplam ${emojisNormal.size + emojisAnimated.size} adet emoji bulunuyor.`,
      fields: [
        {
          name: '**»** Emoji Miktarları',
          value:
            `**•** Hareketsiz Emojiler: \`${emojisNormal.size}\`\n` +
            `**•** Hareketli Emojiler: \`${emojisAnimated.size}\``,
        },
      ],
      description: `**•** Emojileri görüntülemek için aşağıdaki butonları kullanabilirsiniz.`
    };

    let mainPageButton = new ButtonBuilder().setLabel('Ana Sayfa').setCustomId("mainPageButton").setStyle('Primary');
    let emojisPageButton = new ButtonBuilder().setLabel('Hareketsiz Emojiler').setCustomId("emojisPageButton").setStyle('Primary');
    let animatedPageButton = new ButtonBuilder().setLabel('Hareketli Emojiler').setCustomId("animatedPageButton").setStyle('Primary');

    const reply = await interaction.reply({
      embeds: [embed],
      components: [
        {
          data: { type: 1 }, components: [
            mainPageButton.setDisabled(true), emojisPageButton, animatedPageButton
          ]
        }
      ]
    });

    const replyMessage = interaction.type === 2 && await interaction.fetchReply();
    const filter = i => {
      return i.message.id === (interaction.type === 2 ? replyMessage : reply).id && i.deferUpdate() && i.user.id === (interaction.type === 2 ? interaction.user : interaction.author).id;
    };
    const collector = reply.createMessageComponentCollector({ filter, time: 600000 });

    collector.on('collect', async btn => {

      if (btn.customId === "mainPageButton") {

        let messageContent = {
          embeds: [embed],
          components: [
            {
              type: 1, components: [
                mainPageButton.setDisabled(true), emojisPageButton.setDisabled(false), animatedPageButton.setDisabled(false)
              ]
            }
          ]
        };
        if (interaction.type === 2)
          await interaction.editReply(messageContent);
        else await reply.edit(messageContent);

      } else if (btn.customId === "emojisPageButton") {

        if (!emojisNormal.size) {
          let messageContent = {
            embeds: [
              {
                color: client.settings.embedColors.red,
                author: {
                  name: `${client.user.username} • Emojiler`,
                  icon_url: client.settings.icon,
                },
                description: `**»** Bu sunucuda hiç hareketsiz emoji yok.`
              }
            ],
            components: [
              {
                type: 1, components: [
                  mainPageButton.setDisabled(false), emojisPageButton.setDisabled(true), animatedPageButton.setDisabled(false)
                ]
              }
            ]
          };
          if (interaction.type === 2)
            return await interaction.editReply(messageContent);
          else return await reply.edit(messageContent);
        }

        const emojisNormalString = emojisNormal.map(emoji => emoji.toString()).join(' ');

        let messageContent = {
          embeds: [
            {
              color: client.settings.embedColors.default,
              author: {
                name: `${client.user.username} • Emojiler`,
                icon_url: client.settings.icon,
              },
              title: `**»** Hareketsiz Emojiler (**${emojisNormal.size}**)`,
              description: client.functions.truncate(emojisNormalString, 4000)
            }
          ],
          components: [
            {
              type: 1, components: [
                mainPageButton.setDisabled(false), emojisPageButton.setDisabled(true), animatedPageButton.setDisabled(false)
              ]
            }
          ]
        };
        if (interaction.type === 2)
          await interaction.editReply(messageContent);
        else await reply.edit(messageContent);

      } else if (btn.customId === "animatedPageButton") {

        if (!emojisAnimated.size) {
          let messageContent = {
            embeds: [
              {
                color: client.settings.embedColors.red,
                author: {
                  name: `${client.user.username} • Emojiler`,
                  icon_url: client.settings.icon,
                },
                description: `**»** Bu sunucuda hiç hareketli emoji yok.`
              }
            ],
            components: [
              {
                type: 1, components: [
                  mainPageButton.setDisabled(true), emojisPageButton.setDisabled(false), animatedPageButton.setDisabled(false)
                ]
              }
            ]
          };
          if (interaction.type === 2)
            return await interaction.editReply(messageContent);
          else return await reply.edit(messageContent);
        }

        const emojisAnimatedString = emojisAnimated.map(emoji => emoji.toString()).join(' ');

        let messageContent = {
          embeds: [
            {
              color: client.settings.embedColors.default,
              author: {
                name: `${client.user.username} • Emojiler`,
                icon_url: client.settings.icon,
              },
              title: `**»** Hareketli Emojiler (**${emojisAnimated.size}**)`,
              description: client.functions.truncate(emojisAnimatedString, 4000)
            }
          ],
          components: [
            {
              type: 1, components: [
                mainPageButton.setDisabled(false), emojisPageButton.setDisabled(false), animatedPageButton.setDisabled(true)
              ]
            }
          ]
        };
        if (interaction.type === 2)
          await interaction.editReply(messageContent).catch(() => { });
        else await reply.edit(messageContent);

      }

    });

    collector.on('end', async collected => {

      let components = [
        {
          type: 1,
          components: [mainPageButton.setDisabled(true), emojisPageButton.setDisabled(true), animatedPageButton.setDisabled(true)]
        }
      ];

      if (interaction.type === 2)
        return await interaction.editReply({
          components: components
        }).catch(() => { });
      else return await reply.edit({
        components: components
      }).catch(() => { });

    });

  }
};