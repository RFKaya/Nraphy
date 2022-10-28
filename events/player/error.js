module.exports = (client, queue, error, ...args) => {

    client.logger.error(error)

    switch (error) {
        case 'NotPlaying':
            queue.metadata.channel.send({
                embeds: [
                    {
                        color: client.settings.embedColors.red,
                        title: '**»** Bir Hata Oluştu!',
                        description: `**•** Şu an herhangi bir müzik çalmıyor.`
                    }
                ]
            });
            break;
        case 'NotConnected':
            queue.metadata.channel.send({
                embeds: [
                    {
                        color: client.settings.embedColors.red,
                        title: '**»** Bir Hata Oluştu!',
                        description: `**•** Herhangi bir sesli kanalda değilsin!`
                    }
                ]
            });
            break;
        case 'UnableToJoin':
            queue.metadata.channel.send({
                embeds: [
                    {
                        color: client.settings.embedColors.red,
                        title: '**»** Bir Hata Oluştu!',
                        description: `**•** Bulunduğun sesli odaya katılamıyorum! Lütfen izinlerimi kontrol et.`
                    }
                ]
            });
            break;
        case 'VideoUnavailable':
            queue.metadata.channel.send({
                embeds: [
                    {
                        color: client.settings.embedColors.red,
                        title: '**»** Bir Hata Oluştu!',
                        description: `**•** **${args[0].title}**, oynatılamıyor. Bu şarkı atlanıyor...`
                    }
                ]
            });
            break;
        case 'MusicStarting':
            queue.metadata.channel.send({
                embeds: [
                    {
                        color: client.settings.embedColors.red,
                        title: '**»** Bir Hata Oluştu!',
                        description: `**•** Müzik başlatılamadı, tekrar dene!`
                    }
                ]
            });
            break;
        default:
            queue.metadata.channel.send({
                embeds: [
                    {
                        color: client.settings.embedColors.red,
                        title: '**»** Bir Hata Oluştu!',
                        description: `**•** İçerik gizlenmiş veya kaldırılmış olabilir, belirli ülkelerde mevcut olmayabilir ya da en muhtemel sebep ile yaş kısıtlamasına sahiptir.\`\`\`${error}\`\`\``
                    }
                ]
            });
    };
};
