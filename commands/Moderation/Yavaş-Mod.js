const humanize = require("humanize-duration");

module.exports = {
  interaction: {
    name: "yavaş-mod",
    description: "Yavaş mod (Slowmode)'u ayarlamanızı sağlar.",
    options: [
      {
        name: "saniye",
        description: "Yavaş modun kaç saniye olacağını gir.",
        type: 4,
        max_value: 21600,
        min_value: 0,
        required: true
      },
    ]
  },
  interactionOnly: true,
  aliases: ["slow-mode", "slowmode", "yavas-mod", "yavasmod", "yavaşmod", "slowmod", "slovmode", "slovmod"],
  category: "Moderation",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["ManageChannels"],
  cooldown: 5000,

  async execute(client, interaction, data) {

    const limit = interaction.options.getInteger("saniye");

    /* if (!limit)
      return interaction.reply({
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
      }); */

    /* if (limit > 21600)
      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yavaş Mod Süresi En Fazla **21600** Saniye Olabilir!',
            description: `**•** Örnek kullanım: \`/yavaş-mod 1800\``
          }
        ]
      }); */

    /* if (isNaN(limit) || limit.includes(',') || limit.includes('.'))
      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Yavaş Mod Süresine Yalnızca Sayı Girmelisin (Saniye Olarak)!',
            description: `**•** Örnek kullanım: \`/yavaş-mod 10\``
          }
        ]
      }); */

    if (limit == interaction.channel.rateLimitPerUser)
      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: `**»** Yavaş Mod Süresi Zaten **${interaction.channel.rateLimitPerUser} Saniye**!`,
            description: `**•** Yani, ne değişecekti ki?`
          }
        ]
      });

    await interaction.channel.setRateLimitPerUser(limit, `kanove • Yavaş-Mod (Slowmode) Ayarlama Sistemi (${interaction.user.tag} tarafından ayarlandı.)`);

    if (limit == 0)
      return await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Yavaş Mod Süresi Başarıyla Sıfırlandı!',
            description: `**•** Artık üyeler yavaş mod limitlerine takılmadan yazabilir.`
          }
        ]
      });
    else return await interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.green,
          title: `**»** Yavaş Mod Süresi Başarıyla Ayarlandı!`,
          description: `**•** Artık üyeler her **${humanize(parseInt(limit) * 1000, { language: "tr", round: true })}** sürede bir mesaj gönderebilecek.`
        }
      ]
    });

  }
};