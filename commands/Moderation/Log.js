const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "log",
    description: "Log sistemiyle ilgili tüm komutlar. (Beta)",
    options: [
      {
        name: "bilgi",
        description: "Log sistemi hakkında bilgi verir. (Beta)",
        type: 1,
        options: []
      },
      {
        name: "ayarla",
        description: "Log sisteminin kanalını ayarlar. (Beta)",
        type: 1,
        options: [
          {
            name: "kanal",
            description: "Logların iletileceği kanalı seç.",
            type: 7,
            required: true
          }
        ]
      },
      {
        name: "kapat",
        description: "Log sistemini kapatır. (Beta)",
        type: 1,
        options: []
      },
    ],
  },
  interactionOnly: true,
  aliases: ["logger"],
  category: "Moderation",
  memberPermissions: ["Administrator"],
  botPermissions: ["SendMessages", "EmbedLinks", "ManageGuild", "ViewAuditLog", "ManageWebhooks"],
  nsfw: false,
  cooldown: 10000,
  ownerOnly: false,
  voteRequired: true,

  async execute(client, interaction, data) {

    const getCommand = interaction.options.getSubcommand();

    if (getCommand == "bilgi") {

      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Log Sistemi (Beta)`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Log Sistemi Nedir, Ne İşe Yarar?',
                value: `**•** Sunucudaki olayların kayıtlarını ayarladığınız kanalda bildirir. Örneğin düzenlenen bir mesajın düzenlenmeden önceki hâlini, silinen mesajın içeriğini vb.`,
              },
              {
                name: '**»** Log Sistemi Hangi Olayları Bildirir?',
                value:
                  `**•** Mesaj Düzenleme ve Silme (İçerikleriyle birlikte)\n` +
                  `**•** Emoji Oluşturma, Düzenleme ve Silme\n` +
                  `**•** Yakında daha fazla olay bildirir hâle gelecek.`,
              },
              {
                name: '**»** Log Sistemi Nasıl Açılır?',
                value: `**•** \`/log ayarla\` komutuyla log kanalını ayarlayabilirsiniz.`,
              },
              {
                name: '**»** Log Sistemi Nasıl Kapatılır?',
                value: `**•** Log sistemini kapatma seçeneğini eklemeye üşendim. Beta zaten sıkıntı yok. Şimdilik log kanalını ayarladığınız Webhook'u kanal ayarlarından silerek kapatabilirsiniz.`,
              },
              {
                name: '**»** Madem Hazır Değildi Neden Çıkardın Başımıza Bu Log Sistemini?',
                value: `**•** Bunun için bana kızmayın üzülürüm. Log sistemi bir anda olacak iş değil, yavaşça ve sizin önerilerinizle geliştirilecek. Bu yüzden \`/bildir\` komutuyla bug/öneri bildirileri yapmayı unutmayın. Anlayışınız için teşekkürler.`,
              },
            ],
            image: {
              url: "https://cdn.discordapp.com/attachments/892082183710330950/994300796638347445/unknown.png"
            }
          }
        ],
      });

    } else if (getCommand == "ayarla") {

      const getChannel = interaction.options.getChannel("kanal");

      //Kanal Kontrol
      const { channelChecker } = require("../../modules/Functions");
      if (await channelChecker(interaction, getChannel, ["ViewChannel", "SendMessages", "EmbedLinks", "ManageChannels", "ManageWebhooks"], false)) return;

      await interaction.deferReply();

      //Zaten o kanalda aktif mi?
      if (data.guild.logger?.webhook && (await getChannel.fetchWebhooks()).find(webhook => webhook.url === data.guild.logger.webhook))
        return interaction.editReply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** O Kanalda Zaten Bu Sistem Aktif!',
              description: `**•** Bir sorun mu var? Destek sunucumuza gelebilirsin \:)`
            }
          ],
          components: [
            {
              data: { type: 1 }, components: [
                new ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')
              ]
            },
          ]
        });

      const webhook = await getChannel.createWebhook({
        name: 'Nraphy Logger (Beta)',
        avatar: 'https://media.discordapp.net/attachments/727501328519004200/910108789796110346/Nraphy-Test-Logo-Kare.png',
        reason: `Nraphy Log Sistemi • ${interaction.user.tag} tarafından açıldı.`
      }).catch(err => {
        client.logger.error(err);
        return interaction.editReply(`Log kanalını ayarlayamadım. Yetkilerimle ilgili bir sorun olabilir. Çözemezsen destek sunucumuzda bildirebilirsin.\n\nhttps://discord.gg/QvaDHvuYVm`);
      });

      data.guild.logger.webhook = webhook.url;
      data.guild.markModified('logger.webhook');
      await data.guild.save();

      return interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: `**»** Log Sistemi \`#${getChannel.name}\` Kanalına Ayarlandı!`,
            url: getChannel.url,
            description: `**•** Bir mesaj yazıp silerek log sistemini deneyebilirsin \:)`
          }
        ]
      });

    } else if (getCommand == "kapat") {

      return interaction.reply("Kapatma henüz mevcut değil. Kanal ayarlarına gir webhook'u sil.");

    }

  }
};