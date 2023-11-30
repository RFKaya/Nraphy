const { ButtonBuilder } = require('discord.js');

module.exports = async (client, error, channel, interaction) => {

  var messageContent;

  if (error.toString().includes('ERR_OUT_OF_SPACE')) {
    messageContent = {
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: `**»** Şarkı Sırası Tamamen Dolu! (200/200)`,
          description: `**•** **Nraphy Boost** ile bu limiti sınırsıza çıkarabilirsin! \`/boost bilgi\``
        }
      ],
    };

  } else if (error.toString().includes('ERR_NO_RESULT')) {
    messageContent = {
      embeds: [
        {
          color: client.settings.embedColors.red,
          description: `**»** Bu şarkı SoundCloud üzerinde bulunamadı.`,
        }
      ],
    };

  } else return client.logger.error(error);

  if (interaction) {
    if (interaction.type == 2 && (interaction.replied || interaction.deferred))
      return interaction.editReply(messageContent);
    else return interaction.reply(messageContent);
  } else if (channel) {
    return channel.send(messageContent);
  } else return client.logger.error("müzik sisteminde hata var ama cevap verecek kanal yok aq", error);

};
