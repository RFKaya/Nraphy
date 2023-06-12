const permissions = require("../../utils/Permissions.json");

module.exports = async (client, member, memberCounter, inviteManager, guildData) => {

  const channel = memberCounter.channel;

  try {

    if (!member.guild.channels.cache.has(channel)) {

      client.logger.log(`Davet&Sayaç kanalı bulunamadı, sunucudaki sayaç sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
      guildData.memberCounter = undefined;
      guildData.inviteManager = undefined;
      await guildData.save();

      return member.guild.channels.cache.get(memberCounter.setupChannel)?.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Sayaç & Davet Kanalı Bulunamadığı İçin Sayaç Sıfırlandı!',
            description: `**•** Lütfen tekrar ayarlayınız.`
          }
        ]
      });

    }

    let clientPerms = [];
    ["ViewChannel", "SendMessages", "EmbedLinks"].forEach((perm) => {
      if (!member.guild.channels.cache.get(channel).permissionsFor(member.guild.members.me).has(perm)) {
        clientPerms.push(permissions[perm]);
      }
    });

    if (clientPerms.length > 0) {

      client.logger.log(`Davet&Sayaç kanalında bir/birkaç yetkim bulunmadığı için sayaç sistemi sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
      guildData.memberCounter = undefined;
      guildData.inviteManager = undefined;
      await guildData.save();

      return member.guild.channels.cache.get(memberCounter.setupChannel)?.send({
        embeds: [{
          color: client.settings.embedColors.red,
          author: {
            name: `Sayaç & Davet Sistemlerini Çalıştırabilmem İçin Gereken İzinlere Sahip Değilim!`,
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

    const cachedInvites = client.guildInvites.get(member.guild.id);
    const newInvites = await member.guild.invites.fetch();

    const usedInvite = newInvites.find(inv => cachedInvites?.get(inv.code) < inv.uses);
    //console.log("Cached", [...cachedInvites.keys()])
    //console.log("New", [...newInvites.values()].map(inv => inv.code))
    //console.log("Used", usedInvite)
    //console.log(`The code ${usedInvite.code} was just used by ${member.user.username}.`)

    //Davetçinin davet ettiği üyelere bu üyeyi pushlama 
    if (usedInvite && !inviteManager.invites?.[usedInvite.inviter.id]?.includes(member.id)) {

      guildData.inviteManager.invites ||= {};
      guildData.inviteManager.invites[usedInvite.inviter.id] ||= [];

      guildData.inviteManager.invites[usedInvite.inviter.id].push(member.id);
      guildData.markModified('inviteManager');
      await guildData.save();

    }

    newInvites.each(inv => cachedInvites?.set(inv.code, inv.uses));
    client.guildInvites.set(member.guild.id, cachedInvites);

    let joinEmbed = {
      color: client.settings.embedColors.green,
      author: {
        name: `${member.user.tag} Katıldı!`,
        icon_url: member.user.displayAvatarURL(),
      },
      description:
        `📥 • **${memberCounter.target}** üye olmamıza **${memberCounter.target - member.guild.memberCount}** üye kaldı.\n` +
        ((!usedInvite || member.user.bot)
          ? `📩 • Davet eden bulunamadı.`
          : `📩 • **${usedInvite.inviter.tag}** tarafından davet edildi. (**${inviteManager.invites?.[usedInvite.inviter.id]?.length || 1}** daveti bulunuyor.)`),
    };

    if (member.user.bot) joinEmbed.author.name += ` (Bot 🤖)`;

    member.guild.channels.cache.get(channel).send({
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