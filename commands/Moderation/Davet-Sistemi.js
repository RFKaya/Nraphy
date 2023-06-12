module.exports = {
  interaction: {
    name: "davet-sistemi",
    description: "Kimin, kimi davet ettiğini gösteren sistem.",
    options: [
      {
        name: "bilgi",
        description: "Davet sistemi hakkında tüm bilgileri sağlar.",
        type: 1,
        options: []
      },
      {
        name: "ayarla",
        description: "Davet sisteminini ayarlar.",
        type: 1,
        options: [
          {
            name: "kanal",
            description: "Davet mesajlarının gönderileceği kanalı seç.",
            type: 7,
            required: true
          },
        ]
      },
      {
        name: "sıfırla",
        description: "Davet sistemi ayarlarını sıfırlar.",
        type: 2,
        options: [
          {
            name: "istatistikler",
            description: "Davet sistemini kapatmadan istatistikleri sıfırlar.",
            type: 1,
            options: []
          },
        ]
      },
      {
        name: "kapat",
        description: "Davet sistemini kapatır.",
        type: 1,
        options: []
      }
    ],
  },
  interactionOnly: true,
  aliases: ["gelengiden", 'gelen-giden', 'davetsistemi'],
  category: "Moderation",
  memberPermissions: ["ManageChannels"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageGuild"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,
  voteRequired: true,

  async execute(client, interaction, data) {

    const getSubcommand = interaction.options.getSubcommandGroup(false);
    const getCommand = interaction.options.getSubcommand();

    if (getCommand == "bilgi") {

      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Davet Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Davet Kanalı Ne İşe Yarar?',
                value: `**•** Sunucuya bir üye katıldığında; ayarladığınız kanala, o üyeyi kimin davet ettiğini bildirir.`,
              },
              {
                name: '**»** Davet Sıralamasına Nasıl Ulaşırım?',
                value: `**•** \`/sıralama\` komutunu çalıştırıp, mesajın altındaki butonlardan davet sıralamasını seçerek sıralamaya ulaşabilirsiniz.`,
              },
              {
                name: '**»** Kendimin veya Başkasının Davetlerine Nasıl Ulaşırım?',
                value: `**•** \`/davetler\``,
              },
              {
                name: '**»** Sayaç Sistemiyle Uyumu!',
                value: `**•** Eğer sayaç kanalıyla davet kanalını aynı yaparsanız sayaç sistemiyle tam uyumlu olarak çalışıp tek mesaj içerisinde iki sistemin bilgilerini de verecektir.`,
              },
              {
                name: '**»** Davet Kanalı Nasıl Ayarlanır?',
                value: `**•** \`/davet-sistemi Ayarla\` yazarak davet sistemini açabilirsiniz.`,
              },
              {
                name: '**»** Davet Kanalı Nasıl Sıfırlanır?',
                value: `**•** \`/davet-sistemi Kapat\` yazarak davet sistemini kapatabilirsiniz.`,
              },
              {
                name: '**»** Ek Bilgiler',
                value:
                  `**•** Nraphy'nin, ayarladığınız davet kanalını görebilme ve mesaj yazma yetkisi olduğuna emin olun. Aksi hâlde davet sistemi otomatik olarak sıfırlanacaktır.\n` +
                  `**•** Sadece sunucuya katılan üyeler için çalışır. Sunucudan ayrılan bir üye olduğunda bildirmez.`
              },
            ],
            image: {
              url: 'https://media.discordapp.net/attachments/801418986809589771/873909005834129479/unknown.png',
            },
          }
        ]
      });

    } else if (getCommand == "ayarla") {

      const { channelChecker } = require("../../modules/Functions");
      const channel = interaction.options.getChannel("kanal");

      //Kanal Kontrol
      if (await channelChecker(interaction, channel, ["ViewChannel", "SendMessages", "EmbedLinks"], false)) return;

      if (data.guild.inviteManager?.channel === channel.id)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Davet Kanalı Zaten Aynı!',
              description: `**•** Sıfırlamak için \`/davet-sistemi Sıfırla\` yazabilirsin.`
            }
          ]
        });

      if (data.guild.inviteManager?.channel && data.guild.inviteManager.channel !== channel.id) {

        data.guild.inviteManager.channel = channel.id;
        data.guild.inviteManager.setupChannel = interaction.channel.id;
        await data.guild.save();

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Davet Kanalı Değiştirildi!',
              description: `**•** Kanal ${channel} olarak değiştirildi.`
            }
          ]
        });

      }

      data.guild.inviteManager.channel = channel.id;
      data.guild.inviteManager.setupChannel = interaction.channel.id;
      await data.guild.save();

      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Davet Sistemi Başarıyla Ayarlandı!',
            author: {
              name: `${client.user.username} • Davet Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Kanal',
                value: `**•** ${channel}`,
              },
            ],
          }
        ]
      });

    } else if (getSubcommand == "sıfırla") {

      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Sıfırlama Şu Anlık Mevcut Değil!',
            description: `**•** Çok yakında güncelleme ile sıfırlama da gelecektir!`
          }
        ]
      });

    } else if (getCommand == "kapat") {

      if (!data.guild.inviteManager?.channel) {
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Davet Sistemi Zaten Kapalı!',
              description: `**•** Açmak için \`/davet-sistemi Ayarla\` yazabilirsin.`
            }
          ]
        });

      }

      data.guild.inviteManager = undefined;
      await data.guild.save();

      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Davet Sistemi Başarıyla Kapatıldı!',
            description: `**•** Tekrar açmak istersen \`/davet-sistemi Ayarla\` yazabilirsin.`
          }
        ]
      });

    }

  }
};