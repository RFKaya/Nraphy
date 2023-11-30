module.exports = async (client, queue, tracks) => {

  return;

  let embed = {
    color: client.settings.embedColors.default,
    title: `**»** ${tracks[0].playlist.title}, Sıraya Eklendi!`,
    description: tracks.map(track => `**•** ${track.title}`).join('\n'),
  };

  /* if (queue.metadata.interaction.type === 2)
    queue.metadata.interaction.editReply({ embeds: [embed] });
  else */ queue.metadata.channel.send({ embeds: [embed] });

};