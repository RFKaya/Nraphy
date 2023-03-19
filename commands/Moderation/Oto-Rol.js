module.exports = {
  interaction: {
    name: "oto-rol",
    description: "Sunucuya katılacak üyelere rol verilir.",
    options: [
      {
        name: "bilgi",
        description: "Otomatik rol sistemi hakkında tüm bilgileri sağlar.",
        type: 1,
        options: []
      },
      {
        name: "ayarla",
        description: "Oto-rol sisteminin ayarlarını ayarlar.",
        type: 2,
        options: [
          {
            name: "rol",
            description: "Oto-rol sisteminin rolünü belirler.",
            type: 1,
            options: [
              {
                name: "rol",
                description: "Sunucuya üye katıldığında verilecek rolü seç.",
                type: 8,
                required: true
              },
            ]
          },
          {
            name: "kanal",
            description: "Rol verildikten sonra mesaj gönderilmesini istediğin kanalı seç.",
            type: 1,
            options: [
              {
                name: "kanal",
                description: "Bir kanal seç.",
                type: 7,
                required: true
              }
            ]
          }
        ]
      },
      {
        name: "sıfırla",
        description: "Otomatik rol sisteminin ayarlarını sıfırlar.",
        type: 1,
        options: [
          {
            name: "işlem",
            description: "Oto-rol kanalı mı sıfırlansın, sistem kapatılsın mı?",
            choices: [
              { name: "Kanal", value: "kanal" },
              { name: "Kapat", value: "kapat" }
            ],
            type: 3,
            required: true
          }
        ]
      },
    ]
  },
  interactionOnly: true,
  aliases: ["otorol", "otorol-ayarla", "oto-rol-ayarla", "otorolayarla"],
  category: "Moderation",
  memberPermissions: ["Administrator"],
  botPermissions: ["ViewChannel", "SendMessages", "EmbedLinks", "ManageRoles"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    const getSubcommand = interaction.options.getSubcommandGroup(false);
    const getCommand = interaction.options.getSubcommand();

    if (getCommand == "bilgi") {

      interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Otomatik Rol Sistemi`,
              icon_url: client.settings.icon,
            },
            fields: [
              {
                name: '**»** Oto-Rol Ne İşe Yarar?',
                value: `**•** Sunucuya yeni katılan üyelere otomatik olarak rol verir. Ayrıca ayarlarsanız, bir kanala bunun mesajını atar.`,
              },
              {
                name: '**»** Oto-Rol\'ün Vereceği Rolü Belirlemek',
                value: `**•** \`/oto-rol Ayarla Rol\` yazarak sunucunuza yeni gelecek olan üyelere otomatik olarak rol vermesini sağlayabilirsiniz.`,
              },
              {
                name: '**»** Oto-Rol\'ün Log Kanalını Ayarlamak',
                value: `**•** \`/oto-rol Ayarla Kanal\` yazarak otomatik rol sistemi bir üyeye rol verdiğinde belirlediğiniz kanala mesaj atmasını sağlayabilirsiniz.`,
              },
              {
                name: '**»** Oto-Rol\'ün Kanala Mesaj Atmasını Kapatmak',
                value: `**•** \`/oto-rol Sıfırla Kanal\` yazarak otomatik rol verildiğinde bir kanala mesaj atmasını kapatabilirsiniz.`,
              },
              {
                name: '**»** Oto-Rol\'ü Kapatmak',
                value: `**•** \`/oto-rol Sıfırla Kapat\` yazarak otomatik rol sistemini kapatabilirsiniz.`,
              },
            ],
          }
        ]
      });

    } else if (getSubcommand == "ayarla") {

      if (getCommand == "rol") {

        const getRole = interaction.options.getRole("rol");

        const { roleChecker } = require("../../modules/Functions");
        if (await roleChecker(interaction, getRole)) return;

        data.guild.autoRole.role = getRole.id;
        data.guild.markModified('autoRole.role');
        await data.guild.save();

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              author: {
                name: `${client.user.username} • Oto-Rol Sistemi`,
                icon_url: client.settings.icon,
              },
              title: '**»** Oto-Rol Sistemi Başarıyla Ayarlandı!',
              fields: [
                {
                  name: '**»** Rol',
                  value: `**•** ${getRole}`,
                },
                {
                  name: '**»** Kanal',
                  value: `**•** ${data.guild.autoRole.channel ? interaction.guild.channels.cache.get(data.guild.autoRole.channel) : `\`/oto-rol Ayarla Kanal\` (**İsteğe bağlı**)`}`,
                },
              ],
            }
          ]
        });

      } else if (getCommand == "kanal") {

        const getChannel = interaction.options.getChannel("kanal");

        if (!data.guild.autoRole.role)
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Once Oto-Rol Rolünü Belirlemelisin!',
                description: `**•** Rolü belirlemek için \`/oto-rol Ayarla Rol\` yazabilirsin.`
              }
            ]
          });

        if (getChannel.type !== 0)
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: `**»** Geçerli Bir Kanal Belirtmelisin!`,
                description: `**•** Belirttiğin kanal, oda veya kategori olmamalı. Sadece yazı kanalı.`,
              }
            ]
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

        if (getChannel.id == data.guild.autoRole.channel)
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Oto-Rol Kanalı Zaten Aynı!',
                description: `**•** Sıfırlamak için \`/oto-rol Sıfırla Kanal\` yazabilirsin.`
              }
            ]
          });

        data.guild.autoRole.channel = getChannel.id;
        data.guild.markModified('autoRole.channel');
        await data.guild.save();

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              author: {
                name: `${client.user.username} • Oto-Rol Sistemi`,
                icon_url: client.settings.icon,
              },
              title: '**»** Oto-Rol Kanalı Başarıyla Ayarlandı!',
              fields: [
                {
                  name: '**»** Rol',
                  value: `**•** ${interaction.guild.roles.cache.get(data.guild.autoRole.role)}`,
                },
                {
                  name: '**»** Kanal',
                  value: `**•** ${getChannel}`,
                },
              ],
            }
          ]
        });

      }

    } else if (getCommand == "sıfırla") {

      const getOperation = interaction.options.getString("işlem");

      if (getOperation == "kapat") {

        if (!data.guild.autoRole.role && !data.guild.autoRole.channel)
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Oto-Rol Sistemi Zaten Kapalı!',
                description: `**•** Her şeyi anladım ama kapalı sistemi kapatmaya çalışanları anlayamadım.`
              }
            ]
          });

        data.guild.autoRole = { role: null, channel: null, setupChannel: null };
        data.guild.markModified('autoRole');
        await data.guild.save();

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Oto-Rol Sistemi Başarıyla Kapatıldı!',
              description: `**•** Artık sunucuya yeni katılan üyelere rol vermeyeceğim.`
            }
          ]
        });

      } else if (getOperation == "kanal") {

        if (!data.guild.autoRole.channel)
          return interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Oto-Rol Kanalı Zaten Yok!',
                description: `**•** Yahu yok. Yok arkadaş yok! Belirlememiş kimse.`
              }
            ]
          });

        data.guild.autoRole.channel = null;
        data.guild.markModified('autoRole.channel');
        await data.guild.save();

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.green,
              title: '**»** Oto-Rol Kanalı Başarıyla Sıfırlandı!',
              description: `**•** Artık rol verdiğimde kanala mesaj atmayacağım.`
            }
          ]
        });

      }

    }

  }
};