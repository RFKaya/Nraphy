module.exports = async (client, queue, song) => {

  try {

    let embed = {
      color: client.settings.embedColors.green,
      title: `**»** Sıraya Bir Şarkı Eklendi!`,
      description: `**•** [${song.name}](${song.url})`,
      thumbnail: {
        url: song.thumbnail,
      },
    };

    if (song.metadata.commandMessage.type === 2)
      song.metadata.commandMessage.editReply({ embeds: [embed] });
    else queue.textChannel.send({ embeds: [embed] });

  } catch (err) { client.logger.error(err); };
};
