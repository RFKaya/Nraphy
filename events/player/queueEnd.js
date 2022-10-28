module.exports = (client, queue) => {
    if (queue) queue.metadata.channel.send({
        embeds: [{
            color: client.settings.embedColors.default,
            title: `**»** Oynatma Sonlandırıldı!`,
            description: `**•** Sırada şarkı kalmadığı için oynatma bitirildi!`,
        }]
    });
};