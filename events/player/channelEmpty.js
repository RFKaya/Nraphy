module.exports = (client, queue) => {
    if (queue) queue.metadata.channel.send({
        embeds: [{
            color: client.settings.embedColors.red,
            title: `**»** Oynatma Sonlandırıldı!`,
            description: `**•** Odada kimse kalmadığı için oynatma bitirildi.`,
        }]
    });
};