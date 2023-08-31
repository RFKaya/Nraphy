const permissions = require("../../utils/Permissions.json");

module.exports = async (client, member, memberCounter, guildData, event) => {

  const channel = member.guild.channels.cache.get(memberCounter.channel);

  try {

    if (!channel) {

      client.logger.log(`Sayaç kanalı bulunamadı, sunucudaki sayaç sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
      guildData.memberCounter = undefined;
      await guildData.save();

      return member.guild.channels.cache.get(memberCounter.setupChannel)?.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Sayaç Kanalı Bulunamadığı İçin Sayaç Sıfırlandı!',
            description: `**•** Tekrar ayarlamak için \`/sayaç Ayarla\` komutunu kullanabilirsiniz.`
          }
        ]
      });

    }

    let clientPerms = [];
    ["ViewChannel", "SendMessages", "EmbedLinks"].forEach((perm) => {
      if (!channel.permissionsFor(member.guild.members.me).has(perm)) {
        clientPerms.push(permissions[perm]);
      }
    });

    if (clientPerms.length > 0) {

      client.logger.log(`Sayaç kanalında bir/birkaç yetkim bulunmadığı için sayaç sistemi sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
      guildData.memberCounter = undefined;
      await guildData.save();

      return member.guild.channels.cache.get(memberCounter.setupChannel)?.send({
        embeds: [{
          color: client.settings.embedColors.red,
          author: {
            name: `Sayaç Sistemini Çalıştırabilmem İçin Gereken İzinlere Sahip Değilim!`,
            icon_url: member.guild.iconURL(),
          },
          description: `**»** ${channel} kanalında yeterli yetkiye sahip olmadığım için sayaç sistemini sıfırladım.`,
          fields: [
            {
              name: '**»** İhtiyacım Olan İzinler;',
              value: "**•** " + clientPerms.map((p) => `${p}`).join("\n**•** "),
            },
          ]
        }]
      });

    }

    let joinEmbed = {
      color: event === "guildMemberAdd" ? client.settings.embedColors.green : client.settings.embedColors.red,
      author: {
        name: `${member.user.tag} ${event === "guildMemberAdd" ? "Katıldı" : "Ayrıldı"}!`,
        icon_url: member.user.displayAvatarURL(),
      },
      description: `📥 • **${memberCounter.target}** üye olmamıza **${memberCounter.target - member.guild.memberCount}** üye kaldı.`,
    };

    if (member.user.bot) joinEmbed.author.name += ` (Bot 🤖)`;

    channel.send({
      embeds: [joinEmbed]
    });

    //Sayaç hedefine ulaşılırsa
    if (memberCounter.target <= member.guild.memberCount) {

      channel.send({
        embeds: [{
          color: client.settings.embedColors.default,
          title: `**»** Tebrikler ${member.guild.name}!`,
          description:
            `**•** Başarıyla **${memberCounter.target}** kullanıcıya ulaştık!\n` +
            `**•** Sayaç hedefini otomatik olarak ikiye katladım!`,
        }]
      });

      guildData.memberCounter.target = guildData.memberCounter.target * 2;
      await guildData.save();

    }

  } catch (err) { client.logger.error(err); };
};