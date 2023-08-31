module.exports = async (client, message, query) => {

  try {

    message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          description: `**»** Bir sonuç bulunamadı!`,
        }
      ]
    }).catch(e => { });

  } catch (err) { client.logger.error(err); };
};
