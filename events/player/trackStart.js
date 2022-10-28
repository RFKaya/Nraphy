module.exports = (client, queue, track) => {
    queue.metadata.channel.send({
        embeds: [
            {
                color: client.settings.embedColors.default,
                title: `**»** **${queue.connection.channel.name}** odasında şimdi oynatılıyor;`,
                description: `**•** [${track.title}](${track.url})`,
                thumbnail: {
                    url: track.thumbnail,
                },
            }
        ],
        components: []
    })
};