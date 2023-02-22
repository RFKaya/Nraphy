const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "çal",
    description: "Bağlantısını veya adını girdiğiniz şarkıyı/oynatma listesini çalar.",
    options: [
      {
        name: "şarkı",
        description: "Bir şarkı adı ya da bağlantısı gir.",
        type: 3,
        required: true
      },
    ]
  },
  aliases: ["play", "p", "oynat", "ç", "oynat"],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
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

    if (interaction.type == 2)
      await interaction.deferReply();
    else await interaction.react('✅');

    try {

      await client.distube.play(interaction.member.voice.channel, music, {
        member: interaction.member,
        textChannel: interaction.channel,
        voiceChannel: interaction.member.voice.channel,
        metadata: {
          commandMessage: interaction
        }
      });

    } catch (error) {

      if (error.errorCode === "NON_NSFW") {

        let messageContent = {
          embeds: [{
            color: client.settings.embedColors.red,
            description: "**»** Yaş kısıtlamalı içerikleri maalesef oynatamıyoruz :/"
          }]
        };

        if (interaction.type == 2)
          return interaction.editReply(messageContent);
        else return interaction.reply(messageContent);

      } else {

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

  },
};