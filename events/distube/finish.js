module.exports = async (client, queue) => {

  try {

    queue.textChannel.send({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: `**»** Oynatma Sonlandırıldı!`,
          description: `**•** Sırada şarkı kalmadığı için oynatma bitirildi!`,
        }
      ]
    }).catch(e => { });

  } catch (err) { client.logger.error(err); };
};
