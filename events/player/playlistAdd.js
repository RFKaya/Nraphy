module.exports = (client, queue, playlist) => {
    queue.metadata.channel.send({
        embeds: [
            {
                color: client.settings.embedColors.default,
                title: `**»** Bir Oynatma Listesi Sıraya Eklendi!`,
                description: `**•** ${playlist.title} (**${playlist.tracks.length}** Şarkı)`,
            }
        ],
        components: []
    });
};