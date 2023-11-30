module.exports = async (client, queue, track) => {

  let embed = {
    color: client.settings.embedColors.green,
    title: `**»** **${queue.channel.name}** odasında şimdi oynatılıyor;`,
    description: `**•** [${track.title}](${track.url})`, //(${song.formattedDuration})
    thumbnail: {
      url: queue.currentTrack.thumbnail,
    },
  };

  /* if (queue.metadata.interaction.type === 2)
    queue.metadata.interaction.editReply({ embeds: [embed] });
  else */ queue.metadata.channel.send({ embeds: [embed] });

};
