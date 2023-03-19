const { ButtonBuilder } = require('discord.js');

module.exports = async (client, error, channel, interaction) => {

  var messageContent;

  try {

    if (error.errorCode === 'VOICE_MISSING_PERMS') {

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Sesli odaya katılmam için yeterli yetkiye sahip değilim."
          }
        ],
      };

    } else if (error.message.includes('Sign in to confirm your age') || error.errorCode === "NON_NSFW") {

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Yaş kısıtlamalı içerikleri maalesef oynatamıyoruz :/"
          }
        ],
      };

    } else if (error.message.includes('Unsupported URL')) {

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Girdiğiniz bağlantı desteklenmiyor."
          }
        ],
      };

    } /*else if (error.message.includes('UNPLAYABLE_FORMATS')) {

      client.logger.error(error);

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Maalesef bu içeriği oynatamıyorum."
          }
        ],
      };

    } else if (error.message.includes('VOICE_CONNECT_FAILED')) {

      client.logger.error(error);

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Ses bağlantısı başarısız oldu. Lütfen tekrar deneyin."
          }
        ],
      };

    }*/ else {

      //console.log(channel);
      client.logger.error(error);

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Hata Oluştu!',
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

    }

    if (messageContent) {
      if (interaction) {
        if (interaction.type == 2 && (interaction.replied || interaction.deferred))
          return interaction.editReply(messageContent);
        else return interaction.reply(messageContent);
      } else if (channel) {
        return channel.send(messageContent);
      }
    }

  } catch (err) { client.logger.error(err); };
};
