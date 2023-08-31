module.exports = async (client, queue, playlist) => {

  try {

    let embed = {
      color: client.settings.embedColors.green,
      title: `**»** Sıraya Bir Oynatma Listesi Eklendi!`,
      description:
        `**•** [${playlist.name}](${playlist.url})\n` +
        `**•** Sıraya **${playlist.songs.length}** şarkı eklendi.`,
      thumbnail: {
        url: playlist.thumbnail,
      },
    };

    if (playlist.metadata.commandMessage.type === 2)
      playlist.metadata.commandMessage.editReply({ embeds: [embed] });
    else queue.textChannel.send({ embeds: [embed] });

  } catch (err) { client.logger.error(err); };
};
