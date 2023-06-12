module.exports = async (client, member) => {

  //Botun kendisi bir sunucuya eklendiyse ya da bir sunucudan atıldıysa return
  if (member.id == client.user.id) return;

  const guildData = await client.database.fetchGuild(member.guild.id);

  let autoRole = guildData?.autoRole;
  let memberCounter = guildData?.memberCounter;
  let inviteManager = guildData?.inviteManager;

  try {

    //Oto-Rol
    if (autoRole?.role) {
      client.logger.log(`OTO-ROL TETİKLENDİ! • ${member.guild.name} (${member.guild.id})`);
      require('./functions/autoRole.js')(client, member, autoRole, guildData);
    };

    //Sayaç & Davet Sistemi
    if (memberCounter?.channel && inviteManager?.channel && memberCounter.channel === inviteManager.channel) {
      client.logger.log(`SAYAÇ & DAVET SİSTEMİ TETİKLENDİ! • ${member.guild.name} (${member.guild.id})`);
      require('./functions/memberCounter&inviteManager.js')(client, member, memberCounter, inviteManager, guildData);
    } else {

      //Sayaç
      if (memberCounter?.channel) {
        client.logger.log(`SAYAÇ TETİKLENDİ! • ${member.guild.name} (${member.guild.id})`);
        require('./functions/memberCounter.js')(client, member, memberCounter, guildData, "guildMemberAdd");
      }

      //Davet Sistemi
      if (inviteManager?.channel) {
        client.logger.log(`DAVET SİSTEMİ TETİKLENDİ! • ${member.guild.name} (${member.guild.id})`);
        require('./functions/inviteManager.js')(client, member, inviteManager, guildData);
      }

    }

  } catch (err) { client.logger.error(err); };
};