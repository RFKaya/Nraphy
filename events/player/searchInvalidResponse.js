module.exports = (client, queue, query, tracks, content, collector) => {
    if (content.toLowerCase() === 'iptal' || content.toLowerCase() === 'cancel') {
        collector.stop();
        return queue.metadata.channel.send({
            embeds: [{
                color: client.settings.embedColors.red,
                description: `**»** Arama işlemi iptal edildi.`,
            }]
        });
    } else queue.metadata.channel.send({
        embeds: [{
            color: client.settings.embedColors.red,
            description: `**»** Sadece **1** ve **${tracks.length}** arasında sayı belirtmelisin!`,
        }]
    });
};