const permissions = require("../../utils/Permissions.json");

module.exports = async (client, member, autoRole, guildData) => {

  try {

    //---------------Rol---------------//

    if (!member.guild.roles.cache.has(autoRole.role)) {

      client.logger.log(`Oto-Rol rolü bulunamadı, sunucudaki oto-rol sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
      guildData.autoRole = { role: null, channel: null, setupChannel: null };
      guildData.markModified('autoRole');
      await guildData.save();

      return member.guild.channels.cache.get(autoRole.setupChannel)?.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Oto-Rol Rolü Bulunamadığı İçin Oto-Rol Sıfırlandı!',
            description: `**•** Tekrar ayarlamak için \`/oto-rol Ayarla\` komutunu kullanabilirsiniz.`
          }
        ]
      });

    }

    if (member.guild.roles.cache.get(autoRole.role).rawPosition >= member.guild.members.me.roles.highest.rawPosition) {

      client.logger.log(`Oto-Rol rolünü verecek yetkim bulunmadığı için sunucudaki oto-rol sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
      guildData.autoRole = { role: null, channel: null, setupChannel: null };
      guildData.markModified('autoRole');
      await guildData.save();

      return member.guild.channels.cache.get(autoRole.setupChannel)?.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Oto-Rol Rolünü Vermek İçin Yetkim Bulunamadığı İçin Oto-Rol Sıfırlandı!',
            description: `**•** Tekrar ayarlamak için \`/oto-rol Ayarla\` komutunu kullanabilirsiniz.`
          }
        ]
      });

    }

    await member.roles.add(autoRole.role);

    //---------------Rol---------------//

    //---------------Kanal---------------//

    if (!autoRole.channel) return;

    if (!member.guild.channels.cache.has(autoRole.channel)) {

      client.logger.log(`Oto-Rol kanalı bulunamadı, sunucudaki oto-rol kanalı sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
      guildData.autoRole.channel = null;
      guildData.markModified('autoRole.channel');
      await guildData.save();

      return member.guild.channels.cache.get(autoRole.setupChannel)?.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Oto-Rol Kanalı Bulunamadığı İçin Oto-Rol Kanalı Sıfırlandı!',
            description: `**•** Tekrar ayarlamak için \`/oto-rol Ayarla Kanal\` komutunu kullanabilirsiniz.`
          }
        ]
      });

    }

    let clientPerms = [];
    ["ViewChannel", "SendMessages", "EmbedLinks"].forEach((perm) => {
      if (!member.guild.channels.cache.get(autoRole.channel).permissionsFor(member.guild.members.me).has(perm)) {
        clientPerms.push(permissions[perm]);
      }
    });

    if (clientPerms.length > 0) {

      client.logger.log(`Oto-Rol kanalında bir/birkaç yetkim bulunmadığı için Oto-Rol kanalı sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
      guildData.autoRole.channel = null;
      guildData.markModified('autoRole');
      await guildData.save();

      return member.guild.channels.cache.get(autoRole.setupChannel)?.send({
        embeds: [{
          color: client.settings.embedColors.red,
          author: {
            name: `Oto-Rol Kanalına Mesaj Gönderebilmem İçin Gereken İzinlere Sahip Değilim!`,
            icon_url: member.guild.iconURL(),
          },
          description: `**»** ${member.guild.channels.cache.get(autoRole.channel)} kanalında yeterli yetkiye sahip olmadığım için oto-rol kanalını sıfırladım.`,
          fields: [
            {
              name: '**»** İhtiyacım Olan İzinler;',
              value: "**•** " + clientPerms.map((p) => `${p}`).join("\n**•** "),
            },
          ]
        }]
      });

    }

    member.guild.channels.cache.get(autoRole.channel).send({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${member.user.username}, sunucuya katıldı!`,
          icon_url: member.user.avatarURL(),
        },
        description: `**»** Hoş geldin! <@&${autoRole.role}> rolünü otomatik olarak verdim.`,
      }]
    });



    //---------------Kanal---------------//

  } catch (err) { client.logger.error(err); };
};
