const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "atla",
    description: "Anlık çalan şarkıyı atlar, sonraki şarkıya geçer.",
    options: []
  },
  aliases: ['sk', "skip"],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data) {

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

    const queue = client.distube.getQueue(interaction.guild);

    if (!queue || !queue.songs || queue.songs.length == 0)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Şu anda bir şarkı çalmıyor."
        }]
      });

    const guildDataCache = client.guildDataCache[interaction.guild.id] || (client.guildDataCache[interaction.guild.id] = {});
    if (guildDataCache?.games?.musicQuiz || queue.songs[0].metadata.isMusicQuiz)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description:
            "**»** Müzik tahmini oyunu sırasında bu komutu kullanamazsın.\n" +
            "**•** 60 saniye içerisinde doğru tahmin yapılmazsa zaten otomatik atlanır."
        }]
      });

    try {

      await queue.skip();

      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.green,
          description: "**»** Şu anda çalan şarkı atlandı. Bir sonraki şarkıya geçiliyor..."
        }]
      });

    } catch (error) {

      if (error.errorCode === "NO_UP_NEXT") {

        /* return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.red,
            title: "**»** Sırada Bir Şarkı Yok Ki!",
            description: "**•** Tabii `/bitir` yazarsan burayı terk edebilirim 🥺"
          }]
        }); */

        const { buttonConfirmation } = require("../../modules/Functions");
        const buttonConfirmationResult = await buttonConfirmation(
          interaction,
          [
            {
              color: client.settings.embedColors.default,
              title: "**»** Sırada Bir Şarkı Yok Ki!",
              description: "**•** Oynatma bitirilsin mi?"
            }
          ]
        );

        if (interaction.type === 2 ? !buttonConfirmationResult : !buttonConfirmationResult.status) {
          let messageContent = {
            embeds: [
              {
                color: client.settings.embedColors.red,
                description: "**•** Hiçbir eylem yapmadım."
              }
            ],
            components: []
          };

          if (interaction.type === 2)
            return interaction.editReply(messageContent).catch(error => { });
          else return buttonConfirmationResult.reply?.edit(messageContent).catch(error => { });
        }

        queue.stop();

        let messageContent = {
          embeds: [{
            color: client.settings.embedColors.default,
            title: "**»** Oynatma Sonlandırıldı!",
            description: `**•** Şarkı sırası temizlendi ve oynatma bitirildi.`
          }],
          components: []
        };

        if (interaction.type === 2)
          return interaction.editReply(messageContent).catch(error => { });
        else return buttonConfirmationResult.reply?.edit(messageContent).catch(error => { });

      } else {

        client.logger.error(error);
        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.red,
            title: "**»** Bir Hata Oluştu!",
            description:
              `**•** Hatayla ilgili geliştirici bilgilendirildi.\n` +
              `**•** En kısa sürede çözülecektir.`
          }],
          components: [
            {
              type: 1, components: [
                new ButtonBuilder().setLabel('Destek Sunucusu').setURL("https://discord.gg/VppTU9h").setStyle('Link')
              ]
            },
          ]
        });

      }

    }

  },
};