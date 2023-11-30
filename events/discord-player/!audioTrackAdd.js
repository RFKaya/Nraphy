module.exports = async (client, queue, track) => {

  return;

  let embed = {
    color: client.settings.embedColors.green,
    title: `**»** Sıraya Bir Şarkı Eklendi!`,
    description: `**•** [${track.title}](${track.url})`, //(${song.formattedDuration})
    thumbnail: {
      url: track.thumbnail,
    },
  };

  /* if (queue.metadata.interaction.type === 2 && !queue.metadata.interaction.replied)
    queue.metadata.interaction.editReply({ embeds: [embed] });
  else */ queue.metadata.channel.send({ embeds: [embed] });

};