const db = require("quick.db");

module.exports = async (client, member) => {

  const guildData = await client.database.fetchGuild(member.guild.id);

  let autoRole = guildData.autoRole;
  let memberCounter = guildData?.memberCounter;
  let inviteManager = guildData?.inviteManager;

  try {

    //Oto-Rol
    if (autoRole?.role) {
      client.logger.log(`OTO-ROL TETİKLENDİ! • ${member.guild.name} (${member.guild.id})`);
      require('./functions/autoRole.js')(client, member, autoRole, guildData);
    };

    //Sayaç & Davet Sistemi
    if (memberCounter?.channel === inviteManager?.channel) {
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

    //İsim-Temizleme
    if (db.has(`isim-temizle.${member.guild.id}`)) {

      client.logger.log(`İSİM TEMİZLEME TETİKLENDİ! • ${member.guild.name} (${member.guild.id})`);

      const turkishToEnglishMapping = {
        'ı': 'i',
        'İ': 'I',
        'ü': 'u',
        'Ü': 'U',
        'Ö': 'O',
        'ö': 'o',
        'Ç': 'C',
        'ç': 'c',
        'ş': 's',
        'Ş': 'S',
        'Ğ': 'G',
        'ğ': 'g'
      };

      let rakamlar = Array(9).fill(0).map((_, index) => index + 1);
      let nickkontrol = member.user.username.split("").map(c => turkishToEnglishMapping[c] || c).join('');

      if (!tumHarfler('a', 'z').some(harf => nickkontrol.includes(harf))) {
        member.setNickname("#" + member.id.slice("12"));
      }

      function tumHarfler(charA, charZ) {
        let a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
        for (; i <= j; ++i) {
          a.push(String.fromCharCode(i));
        }
        return a;
      }
    }

  } catch (err) { client.logger.error(err); };
};