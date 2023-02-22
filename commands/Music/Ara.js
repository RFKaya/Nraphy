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
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 5000,
  ownerOnly: false,

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
          description: `**»** Bir şarkı adı/bağlantısı girmelisin! \`/çal Faded\``
        }]
      });

    if (music.length > 200)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          title: '**»** Aramak İstediğin Şarkının Adı Çok Uzun!',
          description: `**•** Lütfen **200** karakterden daha kısa bir isim belirt.`
        }]
      });

    if (interaction.type == 2) await interaction.deferReply();

    const results = await client.distube.search(music);

    const embed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Arama Sonuçları`,
        icon_url: client.settings.icon
      },
      title: `**»** "${music}" için arama sonuçları;`,
      description:
        `${results.map((track, i) => `**${i + 1}.** ${track.name}`).join('\n')}\n\n` +
        `**•** Aşağıdaki butonlardan istediğin şarkıyı seçebilir ya da iptal edebilirsin.`,
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

    (interaction.type == 2 ?
      interaction.editReply({
        embeds: [embed],
        components: components
      })
      : interaction.reply({
        embeds: [embed],
        components: components
      })).then(async msg => {

        async function musicPlayer(queryContent) {

          try {

            await client.distube.play(interaction.member.voice.channel, results[queryContent], {
              member: interaction.member,
              textChannel: interaction.channel,
              voiceChannel: interaction.member.voice.channel,
              metadata: {
                commandMessage: interaction
              }
            });

          } catch (error) {

            client.logger.error(error);

            let messageContent = {
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  title: "**»** Bir Hata Oluştu!",
                  description:
                    `**•** Hatayla ilgili geliştirici ekip bilgilendirildi.\n` +
                    `**•** En kısa sürede çözülecektir`
                }
              ],
              components: [
                {
                  type: 1, components: [
                    new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link')
                  ]
                },
              ]
            };
            if (interaction.type == 2)
              return interaction.editReply(messageContent);
            else return interaction.reply(messageContent);

          }

        }

        if (interaction.type === 2) {

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

            });/*.catch(err => {

              return interaction.editReply({
                embeds: [{
                  color: client.settings.embedColors.red,
                  description: `**»** Cevap vermediğin için arama bitirildi.`,
                }],
                components: []
              });

            });*/

        } else {

          const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.author.id;
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

            });/*.catch(err => {

              return msg.edit({
                embeds: [{
                  color: client.settings.embedColors.red,
                  description: `**»** Cevap vermediğin için arama bitirildi.`,
                }],
                components: []
              });

            });*/

        }

      });

  },
};