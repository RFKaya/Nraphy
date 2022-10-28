const request = require('request');
const humanize = require("humanize-duration")

module.exports = {
  name: "yavaş-mod",
  description: "Yavaş mod (Slowmode)'u ayarlamanızı sağlar.",
  usage: "yavaş-mod <0/21600>",
  aliases: ["slow-mode", "slowmode", "yavas-mod", "yavasmod", "yavaşmod", "slowmod", "slovmode", "slovmod"],
  category: "Moderation",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageChannels"],
  nsfw: false,
  cooldown: 5000,
  ownerOnly: false,

  async execute(client, message, args, data) {

    const limit = args[0]

    if (!limit) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${client.user.username} Bot • Yavaş-mod (Slowmode)`,
            icon_url: client.settings.icon,
          },
          fields: [
            {
              name: '**»** Yavaş Mod Nasıl Aktif Edilir / Değiştirilir?',
              value: `**•** \`${data.prefix}yavaş-mod <Saniye>\` yazarak aktif edebilir veya süreyi değiştirebilirsiniz.`,
            },
            {
              name: '**»** Yavaş Mod Nasıl Sıfırlanır?',
              value: `**•** \`${data.prefix}yavaş-mod Sıfırla\` yazarak yavaş mod (Slowmode) sistemini kapatabilirsiniz.`,
              inline: false,
            },
          ],
        }
      ]
    });

    if (args[0].toLocaleLowerCase('tr-TR') === "sıfırla" || args[0].toLocaleLowerCase('tr-TR') === "kapat" || args[0] === "0" || limit < 1) {
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Yavaş Mod Süresi Başarıyla Sıfırlandı!',
            description: `**•** Artık üyeler yavaş mod limitlerine takılmadan yazabilir.`
          }
        ]
      }).then(request({
        url: `https://discord.com/api/v7/channels/${message.channel.id}`,
        method: "PATCH",
        json: { rate_limit_per_user: "0" },
        headers: { "Authorization": `Bot ${client.config.token}` }
      }))
    };

    if (limit > 21600) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Yavaş Mod Süresi En Fazla **21600** Saniye Olabilir!',
          description: `**•** Örnek kullanım: \`${data.prefix}yavaş-mod 1800\``
        }
      ]
    })

    if (isNaN(limit) || limit.includes(',') || limit.includes('.')) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Yavaş Mod Süresine Yalnızca Sayı Girmelisin (Saniye Olarak)!',
          description: `**•** Örnek kullanım: \`${data.prefix}yavaş-mod 10\``
        }
      ]
    })

    var timestamp = parseInt(limit) * 1000;
    var timestampX = humanize(timestamp, { language: "tr", round: true })

    message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.green,
          title: `**»** Yavaş Mod Süresi Başarıyla Ayarlandı!`,
          description: `**•** Artık üyeler her **${timestampX}** sürede bir mesaj gönderebilecek.`
        }
      ]
    })

    message.channel.setRateLimitPerUser(limit, "Nraphy • Slowmode Ayarlama Sistemi")

  }
};