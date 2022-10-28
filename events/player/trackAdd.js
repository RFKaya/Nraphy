module.exports = (client, queue, track) => {
    queue.metadata.channel.send({
        embeds: [
            {
                color: client.settings.embedColors.default,
                title: `**»** Sıraya Bir Şarkı Eklendi!`,
                description: `**•** [${track.title}](${track.url})`,
                thumbnail: {
                    url: track.thumbnail,
                },
            }
        ],
        components: []
    });
};