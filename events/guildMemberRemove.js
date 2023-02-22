const db = require("quick.db");

module.exports = async (client, member) => {

  const guildData = await client.database.fetchGuild(member.guild.id);

  const prefix = guildData.prefix || client.settings.prefix;
  const memberCounter = await db.fetch(`guilds.${member.guild.id}.memberCounter`);
  const inviteManager = await db.fetch(`guilds.${member.guild.id}.inviteManager`);

  try {

    //Sayaç
    if (memberCounter) {

      client.logger.log(`SAYAÇ TETİKLENDİ! • ${member.guild.name} (${member.guild.id})`);

      if (!member.guild.channels.cache.has(memberCounter.channel)) {

        client.logger.log(`Sayaç kanalı bulunamadı, sunucudaki sayaç sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
        db.delete(`guilds.${member.guild.id}.memberCounter`);

        member.guild.channels.cache.get(memberCounter.setupInChannel)?.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Sayaç Kanalı Bulunamadığı İçin Sayaç Sıfırlandı!',
              description: `**•** Tekrar ayarlamak için \`${prefix}sayaç\` komutunu kullanabilirsiniz.`
            }
          ]
        });

      } else {

        const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
        const permissions = require("../utils/Permissions.json");

        let clientPerms = [];

        botPermissions.forEach((perm) => {
          if (!member.guild.channels.cache.get(memberCounter.channel).permissionsFor(member.guild.members.me)?.has(perm)) {
            clientPerms.push(permissions[perm]);
          }
        });

        if (clientPerms.length > 0) {

          client.logger.log(`Sayaç kanalında bir/birkaç yetkim bulunmadığı için sayaç sistemi sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
          db.delete(`guilds.${member.guild.id}.memberCounter`);

          return member.guild.channels.cache.get(memberCounter.setupInChannel).send({
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

        } else {

          //client.logger.log(`Sayaç kanalı sorunsuzca bulundu ve izinler kontrol edildi, sayaç mesajı gönderiliyor... • ${member.guild.name} (${member.guild.id})`);

          let joinEmbed = {
            color: client.settings.embedColors.red,
            author: {
              name: `${member.user.tag} Ayrıldı!`,
              icon_url: member.user.displayAvatarURL({ size: 1024 }),
            },
            description: `📤 **${memberCounter.target}** üye olmamıza **${memberCounter.target - member.guild.memberCount}** üye kaldı.`,
          };

          if (member.user.bot) joinEmbed.author.name = `${member.user.tag} Ayrıldı! (Bot 🤖)`;

          member.guild.channels.cache.get(memberCounter.channel).send({
            embeds: [joinEmbed]
          });

        }
      }
    }

    //Davet Sistemi
    if (inviteManager && inviteManager.invites) {

      for (let user of Object.keys(inviteManager.invites)) {
        if (inviteManager.invites[user].includes(member.id)) {
          let invites = inviteManager.invites[user];
          invites.splice(inviteManager.invites[user].indexOf(member.id), 1);
          db.set(`guilds.${member.guild.id}.inviteManager.invites.${user}`, invites);
          break;
        }
      }

    }

  } catch (err) { client.logger.error(err); };
};
