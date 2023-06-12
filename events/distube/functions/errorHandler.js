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

    } else if (error.errorCode === 'VOICE_FULL') {

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Sesli oda dolu olduğu için katılamıyorum."
          }
        ],
      };

    } else if (error.errorCode === 'NO_RESULT') {

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Bir sonuç bulunamadı."
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

    } else if (error.message.includes('Video unavailable')) {

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: "**»** Bu içerik kullanılamıyor."
          }
        ],
      };

    } else if (error.message.includes('Unknown Playlist')) {

      client.logger.error(error);
      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: "**»** Oynatma Listesi Hatası!",
            description:
              "**•** Oynatma listesine ulaşılamadı. Bunun birçok nedeni olabilir.\n" +
              "**•** Şarkı bağlantısındaki `&list=` kısmı ve devamını silerek tekrar dene."
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

    } else if (error.message.includes('The requested site is known to use DRM protection')) {

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: "**»** DRM Koruması Uyarısı!",
            description:
              "**•** İlgili bağlantıda DRM koruması bulunduğu için erişemiyorum.\n" +
              "**•** Mobil cihazlardan paylaşılan Spotify içeriklerinde bu hata oluşabiliyor.\n\n" +
              "**•** __Çözüm:__\n" +
              "**•** Şarkı/Oynatma listesi => Paylaş => Daha fazla => Bağlantıyı kopyala"
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

    } else {

      //console.log(channel);
      client.logger.error(error);

      messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Hata Oluştu!',
            description:
              `**•** Hatayla ilgili geliştirici bilgilendirildi.\n` +
              `**•** En kısa sürede çözülecektir.`
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
      } else return client.logger.error("müzik sisteminde hata var ama cevap verecek kanal yok aq", error);
    } else return client.logger.error("müzik sisteminde hata var ama cevap verecek mesaj yok aq", error);

  } catch (err) { client.logger.error(err); };
};
