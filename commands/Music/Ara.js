const { QueryType } = require('discord-player');
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
  interactionOnly: false,
  aliases: ['sr', "search"],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    const music = interaction.options?.getString("şarkı") || args.join(' ');

    if (!interaction.member.voice.channel) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        description: "**»** Bir odada değilsin. Herhangi bir odaya geç ve tekrar dene!"
      }]
    });

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        description: "**»** Aynı odada değiliz! Bulunduğum odaya katıl ve tekrar dene!"
      }]
    });

    if (!music) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        description: `**»** Bir şarkı adı/bağlantısı girmelisin! \`/çal Faded\``
      }]
    });

    if (music.length > 200) return interaction.reply({
      embeds: [{
        color: client.settings.embedColors.red,
        title: '**»** Aramak İstediğin Şarkının Adı Çok Uzun!',
        description: `**•** Lütfen **200** karakterden daha kısa bir isim belirt.`
      }]
    });

    if (interaction.type == 2) {

      await interaction.deferReply();

      const playdl = require("play-dl");
      const queue = client.player.createQueue(
        interaction.guild,
        {
          metadata: {
            channel: interaction.channel
          },
          bufferingTimeout: 1000,
          disableVolume: false, // disabling volume controls can improve performance
          leaveOnEnd: true,
          leaveOnStop: true,
          spotifyBridge: false,
          //leaveOnEmpty: true, // not working for now, discord-player issue
          //leaveOnEmptyCooldown: 300000,
          async onBeforeCreateStream(track, source, _queue) {
            if (source === "youtube" && track.url.includes("youtube")) {
              return (await playdl.stream(track.url, { discordPlayerCompatibility: true })).stream;
            }
          }
        });

      const res = await client.player.search(music, {
        requestedBy: interaction.member
      });

      const maxTracks = res.tracks.slice(0, 10);

      const embed = {
        color: client.settings.embedColors.default,
        author: {
          name: `${client.user.username} • Arama Sonuçları`,
          icon_url: client.settings.icon
        },
        title: `**»** "${music}" için arama sonuçları;`,
        description:
          `${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\n` +
          `**•** Aşağıdaki butonlardan istediğin şarkıyı seçebilir ya da iptal edebilirsin.`,
      };

      let button1 = new ButtonBuilder().setEmoji("1️⃣").setCustomId("1").setStyle('Primary');
      let button2 = new ButtonBuilder().setEmoji("2️⃣").setCustomId("2").setStyle('Primary');
      let button3 = new ButtonBuilder().setEmoji("3️⃣").setCustomId("3").setStyle('Primary');
      let button4 = new ButtonBuilder().setEmoji("4️⃣").setCustomId("4").setStyle('Primary');
      let button5 = new ButtonBuilder().setEmoji("5️⃣").setCustomId("5").setStyle('Primary');
      let button6 = new ButtonBuilder().setEmoji("6️⃣").setCustomId("6").setStyle('Primary');
      let button7 = new ButtonBuilder().setEmoji("7️⃣").setCustomId("7").setStyle('Primary');
      let button8 = new ButtonBuilder().setEmoji("8️⃣").setCustomId("8").setStyle('Primary');
      let button9 = new ButtonBuilder().setEmoji("9️⃣").setCustomId("9").setStyle('Primary');
      let button10 = new ButtonBuilder().setEmoji("🔟").setCustomId("10").setStyle('Primary');
      let buttonCancel = new ButtonBuilder().setLabel("İptal").setEmoji("❌").setCustomId("cancel").setStyle('Danger');

      interaction.editReply({
        embeds: [embed],
        components: maxTracks.length >= 6 ? [
          {
            type: 1, components: [
              maxTracks.length >= 1 && button1,
              maxTracks.length >= 2 && button2,
              maxTracks.length >= 3 && button3,
              maxTracks.length >= 4 && button4,
              maxTracks.length >= 5 && button5,
            ]
          },
          {
            type: 1, components: [
              maxTracks.length >= 6 && button6,
              maxTracks.length >= 7 && button7,
              maxTracks.length >= 8 && button8,
              maxTracks.length >= 9 && button9,
              maxTracks.length >= 10 && button10,
            ]
          },
          {
            type: 1, components: [
              buttonCancel
            ]
          },
        ] : [
          {
            type: 1, components: [
              maxTracks.length >= 1 && button1,
              maxTracks.length >= 2 && button2,
              maxTracks.length >= 3 && button3,
              maxTracks.length >= 4 && button4,
              maxTracks.length >= 5 && button5,
            ]
          },
          {
            type: 1, components: [
              buttonCancel
            ]
          },
        ]
      });

      async function musicPlayer(queryContent) {

        /*interaction.channel.send({
            embeds: [{
                color: client.settings.embedColors.default,
                description: `**»** Şarkı başlatılıyor... 🎵`
            }]
        });*///interaction.deferReply()

        try {
          if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
          queue.destroy();
          return await interaction.channel.send({
            embeds: [{
              color: client.settings.embedColors.red,
              title: `**»** Bir Hata Oluştu!`,
              description: `**•** Sesli odanıza katılamadım. İzinlerden kaynaklı olabilir. Tekrar dene.`,
            }]
          });
        }

        queue.play(res.tracks[queryContent - 1]);

        if (!interaction.guild.members.me.voice.channel) {
          await queue.connect(interaction.member.voice.channel);
          queue.play();
        }
      }

      const reply = await interaction.fetchReply();
      const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id && i.message.id === reply.id;
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
                  description: `**•** [${res.tracks[parseInt(btn.customId) - 1].title}](${res.tracks[parseInt(btn.customId) - 1].url})`,
                  thumbnail: {
                    url: res.tracks[parseInt(btn.customId) - 1].thumbnail,
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

      const playdl = require("play-dl");
      const queue = client.player.createQueue(
        interaction.guild,
        {
          metadata: {
            channel: interaction.channel
          },
          bufferingTimeout: 1000,
          disableVolume: false, // disabling volume controls can improve performance
          leaveOnEnd: true,
          leaveOnStop: true,
          spotifyBridge: false,
          //leaveOnEmpty: true, // not working for now, discord-player issue
          //leaveOnEmptyCooldown: 300000,
          async onBeforeCreateStream(track, source, _queue) {
            if (source === "youtube" && track.url.includes("youtube")) {
              return (await playdl.stream(track.url, { discordPlayerCompatibility: true })).stream;
            }
          }
        });

      const res = await client.player.search(music, {
        requestedBy: interaction.member
      });

      const maxTracks = res.tracks.slice(0, 10);

      const embed = {
        color: client.settings.embedColors.default,
        author: {
          name: `${client.user.username} • Arama Sonuçları`,
          icon_url: client.settings.icon
        },
        title: `**»** "${music}" için arama sonuçları;`,
        description:
          `${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\n` +
          `**•** Aşağıdaki butonlardan istediğin şarkıyı seçebilir ya da iptal edebilirsin.`,
      };

      let button1 = new ButtonBuilder().setEmoji("1️⃣").setCustomId("1").setStyle('Primary');
      let button2 = new ButtonBuilder().setEmoji("2️⃣").setCustomId("2").setStyle('Primary');
      let button3 = new ButtonBuilder().setEmoji("3️⃣").setCustomId("3").setStyle('Primary');
      let button4 = new ButtonBuilder().setEmoji("4️⃣").setCustomId("4").setStyle('Primary');
      let button5 = new ButtonBuilder().setEmoji("5️⃣").setCustomId("5").setStyle('Primary');
      let button6 = new ButtonBuilder().setEmoji("6️⃣").setCustomId("6").setStyle('Primary');
      let button7 = new ButtonBuilder().setEmoji("7️⃣").setCustomId("7").setStyle('Primary');
      let button8 = new ButtonBuilder().setEmoji("8️⃣").setCustomId("8").setStyle('Primary');
      let button9 = new ButtonBuilder().setEmoji("9️⃣").setCustomId("9").setStyle('Primary');
      let button10 = new ButtonBuilder().setEmoji("🔟").setCustomId("10").setStyle('Primary');
      let buttonCancel = new ButtonBuilder().setLabel("İptal").setEmoji("❌").setCustomId("cancel").setStyle('Danger');

      interaction.reply({
        embeds: [embed],
        components: maxTracks.length >= 6 ? [
          {
            type: 1, components: [
              maxTracks.length >= 1 && button1,
              maxTracks.length >= 2 && button2,
              maxTracks.length >= 3 && button3,
              maxTracks.length >= 4 && button4,
              maxTracks.length >= 5 && button5,
            ]
          },
          {
            type: 1, components: [
              maxTracks.length >= 6 && button6,
              maxTracks.length >= 7 && button7,
              maxTracks.length >= 8 && button8,
              maxTracks.length >= 9 && button9,
              maxTracks.length >= 10 && button10,
            ]
          },
          {
            type: 1, components: [
              buttonCancel
            ]
          },
        ] : [
          {
            type: 1, components: [
              maxTracks.length >= 1 && button1,
              maxTracks.length >= 2 && button2,
              maxTracks.length >= 3 && button3,
              maxTracks.length >= 4 && button4,
              maxTracks.length >= 5 && button5,
            ]
          },
          {
            type: 1, components: [
              buttonCancel
            ]
          },
        ]
      }).then(async message => {

        async function musicPlayer(queryContent) {

          /*interaction.channel.send({
              embeds: [{
                  color: client.settings.embedColors.default,
                  description: `**»** Şarkı başlatılıyor... 🎵`
              }]
          });*///interaction.deferReply()

          try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
          } catch {
            queue.destroy();
            return await interaction.channel.send({
              embeds: [{
                color: client.settings.embedColors.red,
                title: `**»** Bir Hata Oluştu!`,
                description: `**•** Sesli odanıza katılamadım. İzinlerden kaynaklı olabilir. Tekrar dene.`,
              }]
            });
          }

          queue.play(res.tracks[queryContent - 1]);

          if (!interaction.guild.members.me.voice.channel) {
            await queue.connect(interaction.member.voice.channel);
            queue.play();
          }
        }

        const filter = i => {
          i.deferUpdate();
          return i.user.id === interaction.author.id;
        };

        message.awaitMessageComponent({ filter, time: 120000, max: 1 })
          .then(async btn => {

            if (btn.customId === "cancel") {

              message.edit({
                embeds: [{
                  color: client.settings.embedColors.red,
                  description: `**»** Arama işlemi iptal edildi.`,
                }],
                components: []
              });

            } else {
              message.edit({
                embeds: [
                  {
                    color: client.settings.embedColors.default,
                    title: `**»** Şarkı Seçiliyor... 🎵`,
                    description: `**•** [${res.tracks[parseInt(btn.customId) - 1].title}](${res.tracks[parseInt(btn.customId) - 1].url})`,
                    thumbnail: {
                      url: res.tracks[parseInt(btn.customId) - 1].thumbnail,
                    },
                  }
                ],
                components: []
              });
              musicPlayer(parseInt(btn.customId));
            }

          }).catch(err => {

            client.logger.error(err);

            return message.edit({
              embeds: [{
                color: client.settings.embedColors.red,
                description: `**»** Cevap vermediğin için arama bitirildi.`,
              }],
              components: []
            });

          });

      });

    }

  },
};