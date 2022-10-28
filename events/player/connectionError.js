module.exports = (client, queue, error) => {
    client.logger.error(error)
    if (queue) queue.metadata.channel.send({
        embeds: [
            {
                color: client.settings.embedColors.red,
                title: '**»** Bir Bağlantı Hatası Oluştu!',
                description: `\`\`\`${error}\`\`\``
            }
        ]
    });
};