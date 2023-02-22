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

  async execute(client, interaction, data) {

    const getCommand = interaction.options.getSubcommand();

    if (getCommand == "bilgi") {

      interaction.reply({
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
                  `**•** Emoji Ekleme, Düzenleme ve Silme\n` +
                  `**•** Beta olduğu için şimdilik bu kadar. Yakında diğer olayları da bildirir hâle gelecek.`,
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
          }
        ],
      });

    } else if (getCommand == "ayarla") {

      const getChannel = interaction.options.getChannel("kanal");

      if (!getChannel.type == 0)
        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: `**»** Geçerli Bir Kanal Belirtmelisin!`,
              description: `**•** Belirttiğin kanal, oda veya kategori olmamalı. Sadece yazı kanalı.`,
            }
          ],
          ephemeral: true
        });

      const permissions = require("../../utils/Permissions.json");
      let clientPerms = [];
      this.botPermissions.forEach((perm) => {
        if (!getChannel.permissionsFor(interaction.guild.members.me).has(perm)) {
          clientPerms.push(permissions[perm]);
        }
      });
      if (clientPerms.length > 0) {
        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.red,
            author: {
              name: `#${getChannel.name} Kanalında Gereken İzinlere Sahip Değilim!`,
              icon_url: interaction.guild.iconURL(),
            },
            fields: [
              {
                name: '**»** İhtiyacım Olan İzinler;',
                value: "**•** " + clientPerms.map((p) => `${p}`).join("\n**•** "),
              },
            ]
          }]
        });
      }

      await interaction.deferReply();

      getChannel.createWebhook({
        name: 'Nraphy Logger (Beta)',
        avatar: 'https://media.discordapp.net/attachments/727501328519004200/910108789796110346/Nraphy-Test-Logo-Kare.png',
        reason: `Nraphy Log Sistemi • ${interaction.user.tag} tarafından açıldı.`
      }).then(async webhook => {

        data.guild.logger.webhook = webhook.url;
        data.guild.markModified('logger.webhook');
        await data.guild.save();

        interaction.editReply(`Oldu bu iş! Loglamaya başlıyorum artık. Bir mesaj yazıp silerek deneyebilirsin. Log kanal: ${getChannel}`);
        //db.set(`guilds.${interaction.guild.id}.logger.webhook`, webhook.url)

      }).catch(err => {

        interaction.editReply(`Log kanalını ayarlayamadım. Yetkilerimle ilgili bir sorun olabilir. Çözemezsen destek sunucumuzda bildirebilirsin.\n\nhttps://discord.gg/QvaDHvuYVm`);
        client.logger.error(err);

      });

    } else if (getCommand == "kapat") {

      interaction.reply("kapama yok. kanal ayarlarına gir webhook'u sil.");

    }

  }
};