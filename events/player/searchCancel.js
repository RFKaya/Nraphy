module.exports = (client, queue, query, tracks) => {
    queue.metadata.channel.send({
        embeds: [{
            color: client.settings.embedColors.red,
            description: `**»** Cevap vermediğin için arama işlemi sonlandırıldı.`,
        }]
    });
};