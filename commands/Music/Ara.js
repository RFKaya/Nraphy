const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "ara",
    description: "Şarkı aramanızı ve başlatmanızı sağlar.",
    options: [
      {
        name: "şarkı",
        description: "Bir şarkı adı ya da bağlantısı gir.",
        type: 3,
        required: true
      },
    ]
  },
  aliases: ['sr', "search"],
  category: "Music_Player",
  cooldown: 5000,

  async execute(client, interaction, data, args) {

    if (!interaction.member.voice.channel)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Bir odada değilsin. Herhangi bir odaya geç ve tekrar dene!"
        }]
      });

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Aynı odada değiliz! Bulunduğum odaya katıl ve tekrar dene!"
        }]
      });

    const music = interaction.type == 2 ? interaction.options.getString("şarkı") : args.join(' ');

    if (!music)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: `**»** Bir şarkı adı/bağlantısı girmelisin! \`/ara Faded\``
        }]
      });

    if (music.includes('https://') || music.includes('http://'))
      return require('./Çal.js').execute(client, interaction, data, args);

    if (music.length > 200)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: '**»** Aramak İstediğin Şarkının Adı Çok Uzun!',
          description: `**•** Lütfen **200** karakterden daha kısa bir isim belirt.`
        }]
      });

    if (interaction.type == 2) await interaction.deferReply();

    const results = (await client.player.search(music, { fallbackSearchEngine: "soundcloud" })).tracks;

    const embed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Arama Sonuçları (SoundCloud)`,
        icon_url: client.settings.icon
      },
      title: `**»** "${music}" için arama sonuçları;`,
      description:
        `${results.map((track, i) => `**${i + 1}.** ${track.title}`).join('\n')}\n\n` +
        `**•** Aşağıdaki butonlardan istediğin şarkıyı seçebilir ya da iptal edebilirsin.\n` +
        `**•** Kaynak: [SoundCloud](https://soundcloud.com/) (YouTube geçici olarak devre dışıdır.)`,
    };

    const components = [];
    const numberToEmojiMapping = { 1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣", 5: "5️⃣", 6: "6️⃣", 7: "7️⃣", 8: "8️⃣", 9: "9️⃣", 10: "🔟", };
    for (let i = 0; i < results.length; i++) {
      if (i < 5) {
        if (!components[0]) components.push({ type: 1, components: [] });
        components[0].components.push(new ButtonBuilder().setEmoji(numberToEmojiMapping[i + 1]).setCustomId(i.toString()).setStyle('Primary'));
      } else if (i < 10) {
        if (!components[1]) components.push({ type: 1, components: [] });
        components[1].components.push(new ButtonBuilder().setEmoji(numberToEmojiMapping[i + 1]).setCustomId(i.toString()).setStyle('Primary'));
      }
    }
    components.push(
      {
        type: 1, components: [
          new ButtonBuilder().setLabel("İptal").setEmoji("❌").setCustomId("cancel").setStyle('Danger')
        ]
      }
    );

    const reply = interaction.type == 2 ?
      await interaction.editReply({
        embeds: [embed],
        components: components,
        fetchReply: true
      })
      : await interaction.reply({
        embeds: [embed],
        components: components
      });

    async function musicPlayer(queryContent, reply) {

      try {

        const { track } = await client.player.play(interaction.member.voice.channel, queryContent, {
          blockExtractors: ["YouTubeExtractor"],
          nodeOptions: {
            metadata: { channel: interaction.channel, interaction },
            maxSize: data.guildIsBoosted ? Infinity : 200
          },
          requestedBy: interaction.type == 2 ? interaction.user : interaction.author,
          fallbackSearchEngine: "soundcloud"
        });

        const embed = {
          color: client.settings.embedColors.default,
          title: `**»** ${track.title} Sıraya Eklendi!`,
          description: `**•** [${track.title}](${track.url})`,
          thumbnail: {
            url: track.thumbnail,
          },
        };

        if (interaction.type === 2)
          await interaction.editReply({ embeds: [embed], components: [] });
        else await reply.edit({ embeds: [embed], components: [] }).catch(() => { });

      } catch (error) {

        return require('../../events/discord-player/functions/errorHandler.js')(client, error, interaction.channel, interaction);

      }

    }

    const filter = i => {
      return i.message.id === reply.id && i.deferUpdate() && i.user.id === (interaction.type == 2 ? interaction.user : interaction.author).id;
    };

    await interaction.channel.awaitMessageComponent({ filter, time: 120000, max: 1 })
      .then(async btn => {

        if (btn.customId === "cancel") {
          const messageContent = {
            embeds: [
              {
                color: client.settings.embedColors.red,
                description: `**»** Arama işlemi iptal edildi.`,
              }
            ],
            components: []
          };
          if (interaction.type == 2)
            return await interaction.editReply(messageContent);
          else return await reply.edit(messageContent);
        } else {
          /* const messageContent = {
            embeds: [
              {
                color: client.settings.embedColors.default,
                title: `**»** Şarkı Seçiliyor... 🎵`,
                description: `**•** [${results[parseInt(btn.customId)].title}](${results[parseInt(btn.customId)].url})`,
                thumbnail: {
                  url: results[parseInt(btn.customId)].thumbnail,
                },
              }
            ],
            components: []
          };
          if (interaction.type == 2)
            await interaction.editReply(messageContent);
          else await reply.edit(messageContent); */
          musicPlayer(results[parseInt(btn.customId)], reply);
        }

      }).catch(async (error) => {
        const messageContent = {
          embeds: [
            {
              color: client.settings.embedColors.red,
              description: `**»** Cevap vermediğin için arama bitirildi.`,
            }
          ],
          components: []
        };
        if (interaction.type == 2)
          return await interaction.editReply(messageContent);
        else return await reply.edit(messageContent);
      });

    /* if (interaction.type === 2) {

      const reply = await interaction.fetchReply();
      const filter = i => {
        return i.message.id === reply.id && i.deferUpdate() && i.user.id === interaction.user.id;
      };

      interaction.channel.awaitMessageComponent({ filter, time: 120000, max: 1 })
        .then(async btn => {

          if (btn.customId === "cancel") {
            interaction.editReply({
              embeds: [{
                color: client.settings.embedColors.red,
                description: `**»** Arama işlemi iptal edildi.`,
              }],
              components: []
            });
          } else {
            interaction.editReply({
              embeds: [
                {
                  color: client.settings.embedColors.default,
                  title: `**»** Şarkı Seçiliyor... 🎵`,
                  description: `**•** [${results[parseInt(btn.customId)].name}](${results[parseInt(btn.customId)].url})`,
                  thumbnail: {
                    url: results[parseInt(btn.customId)].thumbnail,
                  },
                }
              ],
              components: []
            });
            musicPlayer(parseInt(btn.customId));
          }

        }).catch(err => {

          return interaction.editReply({
            embeds: [{
              color: client.settings.embedColors.red,
              description: `**»** Cevap vermediğin için arama bitirildi.`,
            }],
            components: []
          });

        });

    } else {

      const filter = i => {
        return i.message.id === msg.id && i.deferUpdate() && i.user.id === interaction.author.id;
      };

      msg.awaitMessageComponent({ filter, time: 120000, max: 1 })
        .then(async btn => {

          if (btn.customId === "cancel") {
            msg.edit({
              embeds: [{
                color: client.settings.embedColors.red,
                description: `**»** Arama işlemi iptal edildi.`,
              }],
              components: []
            });
          } else {
            msg.edit({
              embeds: [
                {
                  color: client.settings.embedColors.default,
                  title: `**»** Şarkı Seçiliyor... 🎵`,
                  description: `**•** [${results[parseInt(btn.customId)].name}](${results[parseInt(btn.customId)].url})`,
                  thumbnail: {
                    url: results[parseInt(btn.customId)].thumbnail,
                  },
                }
              ],
              components: []
            });
            musicPlayer(parseInt(btn.customId));
          }

        }).catch(err => {

          return msg.edit({
            embeds: [{
              color: client.settings.embedColors.red,
              description: `**»** Cevap vermediğin için arama bitirildi.`,
            }],
            components: []
          });

        });

    } */

  }
};