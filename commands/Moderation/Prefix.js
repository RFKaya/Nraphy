module.exports = {
  name: "prefix",
  description: "Prefixi değiştirmenize yarar.",
  usage: "prefix Sıfırla/<Prefix>",
  aliases: ["prefix-ayarla", "prefixayarla", "prefixsıfırla", "prefix-sıfırla"],
  category: "Moderation",
  memberPermissions: ["Administrator"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    let newPrefix = args[0];
    let currentPrefix = data.guild.prefix || client.settings.prefix;

    if (!args[0])
      return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.default,
            title: `**»** Mevcut Prefix: (\`${currentPrefix}\`)`,
            author: {
              name: `${client.user.username} • Prefix Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Prefix Ayarlamak Ne İşe Yarar?',
                value: `**•** Komut kullanırken komutun isminden önce girdiğiniz öneki (\`${currentPrefix}\`) değiştirir.`,
              },
              {
                name: '**»** Prefix Nasıl Ayarlanır?',
                value: `**•** \`${data.prefix}prefix <Prefix>\` yazarak botun önekini değiştirebilirsiniz.`,
              },
              {
                name: '**»** Prefix Nasıl Sıfırlanır?',
                value: `**•** \`${data.prefix}prefix Sıfırla\` yazarak botun prefixini varsayılana (\`${client.settings.prefix}\`) çevirebilirsiniz.`,
              },
            ],
          }
        ]
      });

    if (args[0].toLocaleLowerCase('tr-TR') === "sıfırla") {
      if (data.guild.prefix === client.settings.prefix) {
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bu Sunucuda Zaten Prefix Varsayılanda!',
              description: `**•** Değiştirmek istersen \`${data.prefix}prefix <Prefix>\` yazabilirsin.`
            }
          ]
        })
      } else {

        data.guild.prefix = client.settings.prefix;
        data.guild.markModified('prefix');
        await data.guild.save()

        message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Sunucunun Prefixi Başarıyla Sıfırlandı!',
              description: `**•** Yeni prefix varsayılan \`${client.settings.prefix}\` olarak ayarlandı.`
            }
          ]
        })
      }
    } else if (newPrefix) {

      if (newPrefix.length > 18)
        return message.channel.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Çok Uzun Bir Prefix Belirttin!',
              description: `**•** Prefixin en fazla **18** karakter olabilir.`
            }
          ]
        })

      if (newPrefix === currentPrefix) return message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Botun Prefixi Zaten Aynı!',
            description: `**•** Zaten \`${currentPrefix}\` olarak ayarlı. Tekrar ayarlamana gerek yok yani.`
          }
        ]
      })

      message.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: `**»** Prefix \`${newPrefix}\` Olarak Ayarlandı!!`,
            description: `**•** Artık komutları \`${newPrefix}komutlar\` şeklinde kullanabilirsin.`
          }
        ]
      })

      data.guild.prefix = newPrefix;
      data.guild.markModified('prefix');
      await data.guild.save()

    }
  }
};