module.exports = (client, query) => {
  query.metadata.channel.send({
    embeds: [{
      color: client.settings.embedColors.red,
      description: `**»** Belirttiğin isimde bir şarkı sonucu bulunamadı.`,
    }]
  });
};