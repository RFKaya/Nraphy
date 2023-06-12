module.exports = {
  interaction: {
    name: "sayaç",
    description: "Sayaç sistemi.",
    options: [
      {
        name: "bilgi",
        description: "Sayaç sistemi hakkında tüm bilgileri sağlar.",
        type: 1,
        options: []
      },
      {
        name: "ayarla",
        description: "Sayaç sisteminini ayarlar.",
        type: 1,
        options: [
          {
            name: "kanal",
            description: "Sayaç mesajlarının gönderileceği kanalı seç.",
            type: 7,
            required: true
          },
          {
            name: "hedef",
            description: "Sunucunun ulaşmasını istediğin üye hedefini gir.",
            type: 4,
            required: true
          },
        ]
      },
      {
        name: "kapat",
        description: "Sayaç sistemini kapatır.",
        type: 1,
        options: []
      }
    ],
  },
  interactionOnly: true,
  aliases: ["sayac", "sayaç-ayarla", "sayaçayarla"],
  category: "Moderation",
  memberPermissions: ["Administrator"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const getCommand = interaction.options.getSubcommand();

    if (getCommand == "bilgi") {

      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Sayaç Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Sayaç Kanalı Ne İşe Yarar?',
                value: `**•** Bir hedef ve bir kanal belirlersiniz. Sunucuya bir üye katıldığında, belirttiğiniz hedefe kaç üye kaldığıyla birlikte katılan üyenin bilgilerini gönderir.`,
              },
              {
                name: '**»** Davet Sistemiyle Uyumu!',
                value: `**•** Eğer davet kanalıyla sayaç kanalını aynı yaparsanız davet sistemiyle tam uyumlu olarak çalışıp tek mesaj içerisinde iki sistemin bilgilerini de verecektir.`,
              },
              {
                name: '**»** Sayaç Kanalı Nasıl Ayarlanır?',
                value: `**•** \`/sayaç Ayarla\` komutuyla sayaç sistemini ayarlayabilirsiniz.`,
              },
              {
                name: '**»** Sayaç Kanalı Nasıl Sıfırlanır?',
                value: `**•** \`/sayaç Kapat\` komutuyla sayaç sistemini kapatabilirsiniz.`,
              },
              {
                name: '**»** Ek Bilgiler',
                value:
                  `**•** Nraphy'nin, ayarladığınız sayaç kanalını görebilme ve mesaj yazma yetkisi olduğuna emin olun. Aksi hâlde sayaç sistemi otomatik olarak sıfırlanacaktır.`
              },
            ],
          }
        ]
      });

    } else if (getCommand == "ayarla") {

      const { channelChecker } = require("../../modules/Functions");
      const channel = interaction.options.getChannel("kanal");
      const target = interaction.options.getInteger("hedef");

      //Kanal Kontrol
      if (await channelChecker(interaction, channel, ["ViewChannel", "SendMessages", "EmbedLinks"], false)) return;

      if (!target)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bir Hedef Belirtmelisin!',
              description: `**•** Örnek kullanım: \`/sayaç #Sayaç <Hedef>\``
            }
          ]
        });

      if (isNaN(target))
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Belirttiğin Hedef Sadece Sayı İçermeli!',
              description: `**•** Sunucuda **${interaction.guild.memberCount}** üye bulunuyor.`
            }
          ]
        });

      if (target <= interaction.guild.memberCount)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Sunucudaki Üye Sayısından Fazla Hedef Belirtmelisin!',
              description: `**•** Örnek kullanım: \`/sayaç #Sayaç 300\``
            }
          ]
        });

      //Sayaç hedefi ve kanalı aynı
      if (data.guild.memberCounter?.target === target && data.guild.memberCounter?.channel === channel.id)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Sayaç Kanalı ve Hedefi Zaten Aynı!',
              description: `**•** Kapatmak için \`/sayaç Kapat\` yazabilirsin.`
            }
          ]
        });

      //Sayaç kanalı değiştirildi
      if (data.guild.memberCounter?.target === target && data.guild.memberCounter?.channel !== channel.id) {

        data.guild.memberCounter.channel = channel.id;
        data.guild.memberCounter.setupChannel = interaction.channel.id;
        await data.guild.save();

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Sayaç Kanalı Değiştirildi!',
              description: `**•** Kanal ${channel} olarak değiştirildi.`
            }
          ]
        });

      }

      //Sayaç hedefi değiştirildi
      if (data.guild.memberCounter?.target !== target && data.guild.memberCounter?.channel === channel.id) {

        data.guild.memberCounter.target = target;
        data.guild.memberCounter.setupChannel = interaction.channel.id;
        await data.guild.save();

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Sayaç Hedefi Değiştirildi!',
              description: `**•** Hedef **${target}** olarak değiştirildi.`
            }
          ]
        });

      }

      data.guild.memberCounter = { channel: channel.id, target: target, setupChannel: interaction.channel.id };
      await data.guild.save();

      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            author: {
              name: `${client.user.username} • Sayaç Sistemi`,
              icon_url: client.settings.icon,
            },
            title: '**»** Sayaç Başarıyla Ayarlandı!',
            fields: [
              {
                name: '**»** Kanal',
                value: `**•** ${channel}`,
                inline: true,
              },
              {
                name: '**»** Hedef',
                value: `**•** ${target}`,
                inline: true,
              },
            ],
          }
        ]
      });

    } else if (getCommand == "kapat") {

      if (!data.guild.memberCounter.channel)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Sayaç Sistemi Zaten Kapalı!',
              description: `**•** Kapalı olan bir sistemi neden kapatmak istiyorsun ki?`
            }
          ]
        });

      data.guild.memberCounter = undefined;
      await data.guild.save();

      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Sayaç Sistemi Başarıyla Sıfırlandı!',
            description: `**•** Tekrar ayarlamak için \`/sayaç Ayarla\` yazabilirsin.`
          }
        ]
      });

    }

  }
};