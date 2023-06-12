const { ButtonBuilder } = require('discord.js');

module.exports = {

  buttonConfirmation: async function (interaction, confirmationEmbeds, confirmatoryUserId = null) {

    const confirmButton = new ButtonBuilder().setLabel('Onayla').setCustomId("confirmButton").setStyle('Success');
    const denyButton = new ButtonBuilder().setLabel('İptal Et').setCustomId("denyButton").setStyle('Danger');

    const reply = await interaction.reply({
      embeds: confirmationEmbeds,
      components: [
        {
          type: 1, components: [
            confirmButton, denyButton
          ]
        }
      ]
    });

    if (interaction.type === 0) {

      const filter = i => {
        return i.message.id === reply.id && i.deferUpdate() && i.user.id === (confirmatoryUserId || interaction.author.id);
      };

      return reply.awaitMessageComponent({ filter, time: 180000 })
        .then(btn => {
          if (btn.customId === "confirmButton") return { reply, status: true };
          else if (btn.customId === "denyButton") return { reply, status: false };
        })
        .catch(err => {

          return { reply, status: false };

          /*interaction.editReply({
              embeds: [
                  {
                      color: client.settings.embedColors.red,
                      description: "**»** Herhangi bir seçim yapılmadığı için işlem iptal edildi."
                  }
              ],
              components: []
          })*/

        });

    } else if (interaction.type === 2) {

      const replyMessage = await interaction.fetchReply();
      const filter = i => {
        return i.message.id === replyMessage.id && i.deferUpdate() && i.user.id === (confirmatoryUserId || interaction.user.id);
      };

      return replyMessage.awaitMessageComponent({ filter, time: 180000 })
        .then(btn => btn.customId === "confirmButton" ? true : btn.customId === "denyButton" && false)
        .catch(err => {

          return false;

          /*interaction.editReply({
              embeds: [
                  {
                      color: client.settings.embedColors.red,
                      description: "**»** Herhangi bir seçim yapılmadığı için işlem iptal edildi."
                  }
              ],
              components: []
          })*/

        });

    }

  },

  getLastDays: async function (days) {

    let dates = [];

    let dateNow = new Date();
    let dateNowString = `${dateNow.getDate()}.${(dateNow.getMonth() + 1)}.${dateNow.getFullYear()}`;

    for (let i = 0; i < days; i++) {
      let dateParts = dateNowString.split(".");
      var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

      let newDate = new Date(dateObject);
      let newDateString = `${newDate.getDate()}.${(newDate.getMonth() + 1)}.${newDate.getFullYear()}`;
      dates.push(newDateString);

      let newUpdateDate = new Date(dateObject.setDate(dateObject.getDate() - 1));
      dateNowString = `${newUpdateDate.getDate()}.${(newUpdateDate.getMonth() + 1)}.${newUpdateDate.getFullYear()}`;

    }

    return dates;

  },

  messageChecker: function (interaction, message = '', example = '') {

    if (!message || message.length < 1) {
      interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** Bir Mesaj Belirtmelisin!',
            description: `**•** Örnek kullanım: \`/${example}\``
          }
        ]
      });
      return false;
    }

    if (message.length > 180) {
      interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** Çok Uzun Bir Yazı Belirttin!',
            description: `**•** Mesajın **180** karakterden daha kısa olmalı.`
          }
        ]
      });
      return false;
    }

    if (message.toLowerCase().includes('discord.gg')) {
      interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** Bu Komut İle Reklam Yapamazsın!',
            description: `**•** Mesajında herhangi bir Discord sunucusu davet bağlantısı olmamalıdır.`
          }
        ]
      });
      return false;
    }

    if (message.includes('@here') || message.includes('@everyone')) {
      interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** Bu Komut İle **@everyone & @here** Atamazsın!',
            description: `**•** Mesajında herhangi bir toplu etiket olmamalıdır.`
          }
        ]
      });
      return false;
    }

    return true;
  },

  roleChecker: async function (interaction, role) {

    if (!role?.id || !role?.guild) {
      role = await interaction.guild.roles.cache.get(role);
      if (!role?.id || !role?.guild) {
        return interaction.reply({
          embeds: [
            {
              color: interaction.client.settings.embedColors.red,
              title: '**»** Rolü Bulamadım!',
              description: `**•** Geçerli bir rol ID'si belirtmelisin.`
            }
          ]
        });
      }
    }

    if (role.rawPosition >= interaction.guild.members.me.roles.highest.rawPosition)
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** Belirttiğin Rolü Verme Yetkim Bulunmuyor!',
            description: `**•** Bu rolün üstünde bir role sahip olmalıyım.`
          }
        ]
      });

    if (role.id == interaction.guild.id)
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** \`@everyone\` mu?!',
            description: `**•** What?`
          }
        ]
      });

    if (role.tags?.botId)
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** B-Bu Rolü Seçemezsin!',
            description: `**•** İzin vermiyorum. Hem bu rolü veremem ki.`
          }
        ]
      });

    if (role.tags?.premiumSubscriberRole)
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** Booster Rolü mü?',
            description: `**•** Butona tıklayan booster olacak yani? Olamaz. Huh!`
          }
        ]
      });

    return;
  },

  channelChecker: async function (interaction, channel, permissions, supportsChannelTypeFive = true) {

    const permissionsMap = require("../utils/Permissions.json");

    /*if (!channel)
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** Geçerli Bir Kanal Belirtmelisin!',
            description: `**•** Örnek kullanım: \`${data.prefix}kelime-oyunu #kelime-oyunu\``
          }
        ]
      });*/

    if (!interaction.guild.channels.cache.has(channel.id))
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** Bu Sunucuda Olmayan Bir Kanalı Etiketleyemezsin!',
            description: `**•** Yapma işte. Yapma. Hoşlanmıyorum diyorum bu şakalardan. Hıh.`
          }
        ]
      });

    if (channel.type != 0 && (!supportsChannelTypeFive || channel.type != 5))
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: `**»** Geçerli Bir Kanal Belirtmelisin!`,
            description: `**•** Belirttiğin kanal, oda veya kategori olmamalı. Sadece yazı kanalı.`,
          }
        ],
      });

    for await (let permission of permissions) {
      if (!channel.permissionsFor(interaction.guild.members.me).has(permission)) {
        return interaction.reply({
          embeds: [
            {
              color: interaction.client.settings.embedColors.red,
              title: `**»** Etiketlediğin Kanalda **${permissionsMap[permission]}** Yetkim Bulunmuyor!`,
              description: `**•** İzinlerimi kontrol et ve tekrar dene.`
            }
          ]
        });
      }
    }

    return false;

  },

};