module.exports = async (client, queue, song) => {

  try {

    if (song.metadata.isMusicQuiz) return;

    let embed = {
      color: client.settings.embedColors.green,
      title: `**»** **${queue.voiceChannel.name}** odasında şimdi oynatılıyor;`,
      description: `**•** [${song.name}](${song.url})`, //(${song.formattedDuration})
      thumbnail: {
        url: song.thumbnail,
      },
    };

    if (song.metadata.commandMessage.type === 2 && !song.metadata.commandMessage.replied)
      song.metadata.commandMessage.editReply({ embeds: [embed] });
    else queue.textChannel.send({ embeds: [embed] });

  } catch (err) { client.logger.error(err); };
};
