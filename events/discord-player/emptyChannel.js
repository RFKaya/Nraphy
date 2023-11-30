module.exports = async (client, queue) => {

  let embed = {
    color: client.settings.embedColors.red,
    title: `**»** Oynatma Sonlandırıldı!`,
    description: `**•** Odada kimse kalmadığı için oynatma bitirildi.`,
  };

  return await queue.metadata.channel.send({ embeds: [embed] });

};
