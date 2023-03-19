const permissions = require("../../utils/Permissions.json");

module.exports = async (client, member, inviteManager, guildData) => {

  try {

    if (!member.guild.channels.cache.has(inviteManager.channel)) {

      client.logger.log(`Davet kanalı bulunamadı, sunucudaki davet sistemi sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
      guildData.inviteManager = undefined;
      await guildData.save();

      return member.guild.channels.cache.get(inviteManager.setupChannel)?.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Davet Kanalı Bulunamadığı İçin Davet Sistemi Sıfırlandı!',
            description: `**•** Tekrar ayarlamak için \`/davet-sistemi Ayarla\` komutunu kullanabilirsiniz.`
          }
        ]
      });

    }

    let clientPerms = [];
    ["ViewChannel", "SendMessages", "EmbedLinks"].forEach((perm) => {
      if (!member.guild.channels.cache.get(inviteManager.channel).permissionsFor(member.guild.members.me).has(perm)) {
        clientPerms.push(permissions[perm]);
      }
    });

    if (clientPerms.length > 0) {

      client.logger.log(`Davet kanalında bir/birkaç yetkim bulunmadığı için davet sistemi sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
      guildData.inviteManager = undefined;
      await guildData.save();

      return member.guild.channels.cache.get(inviteManager.setupChannel)?.send({
        embeds: [{
          color: client.settings.embedColors.red,
          author: {
            name: `Davet Sistemini Çalıştırabilmem İçin Gereken İzinlere Sahip Değilim!`,
            icon_url: member.guild.iconURL(),
          },
          description: `**»** ${member.guild.channels.cache.get(inviteManager.channel)} kanalında yeterli yetkiye sahip olmadığım için davet sistemini sıfırladım.`,
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
      //title: `${usedInvite.url}`,
      author: {
        name: `${member.user.tag} Katıldı!`,
        icon_url: member.user.displayAvatarURL(),
      },
      description: (!usedInvite || member.user.bot)
        ? `📩 • Davet eden bulunamadı.`
        : `📩 • **${usedInvite.inviter.tag}** tarafından davet edildi. (**${inviteManager.invites?.[usedInvite.inviter.id]?.length || 1}** daveti bulunuyor.)`,
      //.setDescription(`${member.user.tag} is the ${member.guild.memberCount} to join.\nJoined using ${usedInvite.inviter.tag}\nNumber of uses: ${usedInvite.uses}`)
    };

    if (member.user.bot) joinEmbed.author.name += ` (Bot 🤖)`;

    member.guild.channels.cache.get(inviteManager.channel).send({
      embeds: [joinEmbed]
    });

  } catch (err) { client.logger.error(err); };
};
