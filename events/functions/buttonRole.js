const Discord = require("discord.js");
const { ButtonBuilder, WebhookClient } = require('discord.js');

module.exports = async (client, interaction, guildData) => {

  try {

    if (guildData.buttonRole[interaction.message.id].buttons[interaction.customId]) {

      var buttonRoleMessage = guildData.buttonRole[interaction.message.id];
      var buttonRoleButtonRoleId = guildData.buttonRole[interaction.message.id].buttons[interaction.customId].roleId;

      guildData.buttonRole[interaction.message.id].buttons[interaction.customId].clickAmount += 1;

      if (!interaction.guild.roles.cache.has(buttonRoleButtonRoleId)) {

        if (Object.keys(buttonRoleMessage.buttons).length == 1) {

          delete guildData.buttonRole[interaction.message.id];
          guildData.markModified('buttonRole');
          await guildData.save();

          await interaction.message.edit({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Buton-Rol Rolü Bulunamadığı İçin Buton-Rol Sıfırlandı!',
                description: `**•** Tekrar ayarlamak için \`/buton-rol\` komutunu kullanabilirsiniz.`
              }
            ],
            components: []
          });

          interaction.deferUpdate();

        } else {

          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Buton-Rol Rolü Bulunamadığı İçin Bu Butonu Kullanamazsın!',
                description: `**•** Farklı bir butona tıkla. Ben senin yerine bu butonu sileceğim.`
              }
            ],
          });

        }

      } else if (interaction.guild.roles.cache.get(buttonRoleButtonRoleId).rawPosition >= interaction.guild.members.me.roles.highest.rawPosition) {

        client.logger.log(`Buton-Rol rolünü verecek yetkim bulunmadığı için buton-rol mesajına not bırakılıyor... • ${interaction.guild.name} (${interaction.guild.id})`);

        await interaction.message.edit({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Buton-Rol Rolünü Veremiyorum!',
              description: `**•** ${interaction.guild.roles.cache.get(buttonRoleButtonRoleId)} rolünün üstünde bir rolüm bulunmalı! Gerekli ayarlamaları yaptıktan sonra alttaki butona tıklayarak sistemi kaldığı yerden devam ettirebilirsiniz.`
            }
          ]
        });

        interaction.deferUpdate();

      } else {

        if (interaction.member.roles.cache.has(buttonRoleButtonRoleId)) {

          interaction.member.roles.remove(buttonRoleButtonRoleId);
          interaction.reply({ content: `<@&${buttonRoleButtonRoleId}> rolünü geri aldım!`, ephemeral: true });

        } else {

          interaction.member.roles.add(buttonRoleButtonRoleId);
          interaction.reply({ content: `<@&${buttonRoleButtonRoleId}> rolünü verdim!`, ephemeral: true });

        }

        let amountOfClicks = 0;
        for (let button in buttonRoleMessage.buttons) {
          let buttonData = buttonRoleMessage.buttons[button];
          amountOfClicks += buttonData.clickAmount;
        }
        let totalClicks = amountOfClicks >= 10 ?
          Math.floor(amountOfClicks / 10) * 10 + `+` :
          amountOfClicks;

        if (
          !buttonRoleMessage.lastUpdate?.date ||
          !buttonRoleMessage.lastUpdate.totalClicks ||
          ((Date.now() - buttonRoleMessage.lastUpdate.date > 10000) && (buttonRoleMessage.lastUpdate.totalClicks !== totalClicks))
        ) {

          let embed = {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Buton Rol (Beta)`,
              icon_url: client.settings.icon,
            },
            /*fields: [
                {
                    name: '**»** Toplam Tıklama',
                    value: `**•** ${guildData.buttonRole[interaction.message.id].buttons[interaction.customId].clickAmount}`,
                    inline: true,
                },
            ],*/
            footer: {
              text: `Toplam ${totalClicks} kez tıklandı.`,
              //icon_url: 'https://i.imgur.com/AfFp7pu.png',
            },
          };

          let messageRoles = [];
          let embedComponents = [];

          for (let button in buttonRoleMessage.buttons) {

            let buttonData = buttonRoleMessage.buttons[button];
            let buttonRole = await interaction.guild.roles.cache.get(buttonData.roleId);

            if (!buttonRole) {

              client.logger.error("rol bulunamadı");

            } else {

              messageRoles.push(buttonRole.toString());

              embedComponents.push(new Discord.ButtonBuilder()
                .setLabel(`${buttonRole.name}`)
                .setCustomId(button.toString())
                .setStyle('Primary'));

            }

          }

          if (!messageRoles.length) {
            client.logger.error("bu mesajdaki hiçbir rol durmuyo");
          }

          embed.description = embedComponents.length == 1 ?
            `**•** ${messageRoles[0]} rolünü almak için aşağıdaki butona tıkla!` :
            `**•** ${messageRoles.join(', ')} rollerinden birini almak için aşağıdaki butonlara tıkla!`;

          if (buttonRoleMessage.title) embed.title = `**»** ${buttonRoleMessage.title}`;

          interaction.message.edit({
            content: null,
            embeds: [embed],
            components: [
              {
                type: 1, components: embedComponents
              },
            ]
          });

          guildData.buttonRole[interaction.message.id].lastUpdate = {
            date: Date.now(),
            totalClicks: totalClicks
          };
          guildData.buttonRole[interaction.message.id].lastClicker = interaction.user.id;
          if (!buttonRoleMessage.channelId) guildData.buttonRole[interaction.message.id].channelId = interaction.channel.id;

        }

        guildData.markModified(`buttonRole.${interaction.message.id}`);
        await guildData.save();

      }
    }

  } catch (err) { client.logger.error(err); };
};
