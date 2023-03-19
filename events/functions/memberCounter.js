const permissions = require("../../utils/Permissions.json");

module.exports = async (client, member, memberCounter, guildData, event) => {

  try {

    if (!member.guild.channels.cache.has(memberCounter.channel)) {

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
      if (!member.guild.channels.cache.get(memberCounter.channel).permissionsFor(member.guild.members.me).has(perm)) {
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
          description: `**»** ${member.guild.channels.cache.get(memberCounter.channel)} kanalında yeterli yetkiye sahip olmadığım için sayaç sistemini sıfırladım.`,
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

    member.guild.channels.cache.get(memberCounter.channel).send({
      embeds: [joinEmbed]
    });

    /*if (Number(memberCounter.target) <= member.guild.memberCount) {

      member.guild.channels.cache.get(memberCounter.channel).send({
        embeds: [{
          color: client.settings.embedColors.default,
          title: `**»** Tebrikler ${member.guild.name}!`,
          description: `**•** Başarıyla **${db.fetch(`guilds.${member.guild.id}.memberCounter.target`)}** kullanıcıya ulaştık!\n**•** Sayaç hedefini otomatik olarak ikiye katladım!`,
        }]
      })

      db.set(`guilds.${member.guild.id}.memberCounter.target`, (db.fetch(`guilds.${member.guild.id}.memberCounter.target * 2)`))

    }*/

  } catch (err) { client.logger.error(err); };
};