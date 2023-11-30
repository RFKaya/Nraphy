module.exports = {
  interaction: {
    name: "prefix",
    description: "Prefixi değiştirmenize yarar.",
    options: [
      {
        name: "bilgi",
        description: "Mevcut prefixiniz de dahil, prefix sistemi hakkında tüm bilgileri sağlar.",
        type: 1,
        options: []
      },
      {
        name: "ayarla",
        description: "Oto-Cevap sistemini açar.",
        type: 1,
        options: [
          {
            name: "prefix",
            description: "Değiştirmek istediğin prefixi belirt.",
            type: 3,
            required: true
          },
        ]
      },
      {
        name: "sıfırla",
        description: "Oto-Cevap sistemini kapatır yani sıfırlar.",
        type: 1,
        options: []
      }
    ]
  },
  aliases: ["prefix-ayarla", "prefix-sıfırla"],
  category: "Moderation",
  memberPermissions: ["Administrator"],
  cooldown: 3000,

  async execute(client, interaction, data, args) {

    const currentPrefix = data.guild.prefix || client.settings.prefix;
    const newPrefix = interaction.type == 2 ? interaction.options.getString("prefix") : args?.[0];

    const command = interaction.type == 2 ? interaction.options.getSubcommand() : null;

    if (interaction.type == 2 ? command == "bilgi" : !args?.[0]) {
      return interaction.reply({
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
                value: `**•** \`/prefix Ayarla\` komutuyla Nraphy'nin önekini değiştirebilirsiniz.`,
              },
              {
                name: '**»** Prefix Nasıl Sıfırlanır?',
                value: `**•** \`/prefix Sıfırla\` yazarak Nraphy'nin prefixini varsayılana (\`${client.settings.prefix}\`) çevirebilirsiniz.`,
              },
            ],
          }
        ]
      });

    } else if (interaction.type == 2 ? command == "sıfırla" : args[0].toLocaleLowerCase('tr-TR') == "sıfırla") {

      if (!data.guild.prefix)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bu Sunucuda Zaten Prefix Varsayılanda!',
              description: `**•** Değiştirmek istersen \`/prefix Ayarla\` yazabilirsin.`
            }
          ]
        });

      data.guild.prefix = undefined;
      data.guild.markModified('prefix');
      await data.guild.save();

      await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Sunucunun Prefixi Başarıyla Sıfırlandı!',
            description: `**•** Yeni prefix varsayılan \`${client.settings.prefix}\` olarak ayarlandı.`
          }
        ]
      });

    } else if (newPrefix) {

      if (newPrefix.length > 18)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Çok Uzun Bir Prefix Belirttin!',
              description: `**•** Prefixin en fazla **18** karakter olabilir.`
            }
          ]
        });

      if (newPrefix === currentPrefix)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Botun Prefixi Zaten Aynı!',
              description: `**•** Zaten \`${currentPrefix}\` olarak ayarlı. Tekrar ayarlamana gerek yok yani.`
            }
          ]
        });

      data.guild.prefix = newPrefix;
      data.guild.markModified('prefix');
      await data.guild.save();

      await interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: `**»** Prefix \`${newPrefix}\` Olarak Ayarlandı!!`,
            description:
              `**•** Artık Nraphy komutlarını \`${newPrefix}komutlar\` şeklinde kullanabilirsin.\n` +
              `**•** Ayrıca Nraphy Slash komutlarını da desteklemektedir. Bence çok daha kullanışlı olan Slash komutlarına alışmaya başlamalısın. \`/slash\``
          }
        ]
      });

    }
  }
};