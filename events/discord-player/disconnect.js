module.exports = async (client, queue) => {

  let embed = {
    color: client.settings.embedColors.default,
    title: `**»** Oynatma Sonlandırıldı!`,
    description: `**•** Sırada şarkı kalmadığı için oynatma bitirildi!`,
  };

  return await queue.metadata.channel.send({ embeds: [embed] });

};
