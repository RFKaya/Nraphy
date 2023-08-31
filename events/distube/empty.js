module.exports = async (client, queue) => {

  try {

    queue.textChannel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: `**»** Oynatma Sonlandırıldı!`,
          description: `**•** Odada kimse kalmadığı için oynatma bitirildi.`,
        }
      ]
    }).catch(e => { });

  } catch (err) { client.logger.error(err); };
};
