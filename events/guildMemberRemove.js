module.exports = async (client, member) => {

  //Botun kendisi bir sunucuya eklendiyse ya da bir sunucudan atıldıysa return
  if (member.id == client.user.id) return;

  const guildData = await client.database.fetchGuild(member.guild.id);

  const memberCounter = guildData.memberCounter;
  const inviteManager = guildData.inviteManager;

  try {

    //Sayaç
    if (memberCounter?.channel) {
      client.logger.log(`SAYAÇ TETİKLENDİ! • ${member.guild.name} (${member.guild.id})`);
      require('./functions/memberCounter.js')(client, member, memberCounter, guildData, "guildMemberRemove");
    }

    //Davet Sistemi
    if (inviteManager?.invites) {
      for (let user of Object.keys(inviteManager.invites)) {
        if (inviteManager.invites[user].includes(member.id)) {
          const invites = inviteManager.invites[user];
          invites.splice(inviteManager.invites[user].indexOf(member.id), 1);
          guildData.markModified('inviteManager');
          await guildData.save();
          break;
        }
      }
    }

  } catch (err) { client.logger.error(err); };
};
