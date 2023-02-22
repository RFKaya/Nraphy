const db = require("quick.db");
const permissions = require("../utils/Permissions.json");

module.exports = async (client, member) => {

  const guildData = await client.database.fetchGuild(member.guild.id);
  const quikGuildData = await db.fetch(`guilds.${member.guild.id}`);

  let autoRole = guildData.autoRole;
  let prefix = guildData.prefix || client.settings.prefix;
  let memberCounter = quikGuildData?.memberCounter;
  let inviteManager = quikGuildData?.inviteManager;

  try {

    //Oto-Rol
    if (autoRole?.role) {

      client.logger.log(`OTO-ROL TETİKLENDİ! • ${member.guild.name} (${member.guild.id})`);

      if (!member.guild.roles.cache.has(autoRole.role)) {

        client.logger.log(`Oto-Rol rolü bulunamadı, sunucudaki oto-rol sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
        guildData.autoRole = { role: null, channel: null, setupChannel: null };
        guildData.markModified('autoRole');
        await guildData.save();

        member.guild.channels.cache.get(autoRole.setupChannel)?.send({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Oto-Rol Rolü Bulunamadığı İçin Oto-Rol Sıfırlandı!',
              description: `**•** Tekrar ayarlamak için \`/oto-rol Ayarla\` komutunu kullanabilirsiniz.`
            }
          ]
        });

      } else {

        if (member.guild.roles.cache.get(autoRole.role).rawPosition >= member.guild.members.me.roles.highest.rawPosition) {

          client.logger.log(`Oto-Rol rolünü verecek yetkim bulunmadığı için sunucudaki oto-rol sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
          guildData.autoRole = { role: null, channel: null, setupChannel: null };
          guildData.markModified('autoRole');
          await guildData.save();

          member.guild.channels.cache.get(autoRole.setupChannel)?.send({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Oto-Rol Rolünü Vermek İçin Yetkim Bulunamadığı İçin Oto-Rol Sıfırlandı!',
                description: `**•** Tekrar ayarlamak için \`/oto-rol Ayarla\` komutunu kullanabilirsiniz.`
              }
            ]
          });

        } else {

          member.roles.add(autoRole.role);

        }

      }

      if (autoRole.channel) {

        if (!member.guild.channels.cache.has(autoRole.channel)) {

          client.logger.log(`Oto-Rol kanalı bulunamadı, sunucudaki oto-rol kanalı sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
          guildData.autoRole.channel = null;
          guildData.markModified('autoRole.channel');
          await guildData.save();

          member.guild.channels.cache.get(autoRole.setupChannel).send({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Oto-Rol Kanalı Bulunamadığı İçin Oto-Rol Kanalı Sıfırlandı!',
                description: `**•** Tekrar ayarlamak için \`/oto-rol Ayarla Kanal\` komutunu kullanabilirsiniz.`
              }
            ]
          });

        } else {

          const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];

          let clientPerms = [];

          botPermissions.forEach((perm) => {
            if (!member.guild.channels.cache.get(autoRole.channel).permissionsFor(member.guild.members.me).has(perm)) {
              clientPerms.push(permissions[perm]);
            }
          });

          if (clientPerms.length > 0) {

            client.logger.log(`Oto-Rol kanalında bir/birkaç yetkim bulunmadığı için Oto-Rol kanalı sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
            db.delete(`guilds.${member.guild.id}.inviteManager.channel`);

            return member.guild.channels.cache.get(autoRole.setupChannel).send({
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


          } else {

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

          }
        }

      }

    };

    var ortakSistem_embed = {};
    var ortakSistem_title;
    var ortakSistem_sayaç;
    var ortakSistem_davet;
    var ortakSistem = ((memberCounter && memberCounter.channel && inviteManager && inviteManager.channel) && memberCounter.channel == inviteManager.channel);

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

        let clientPerms = [];

        botPermissions.forEach((perm) => {
          if (!member.guild.channels.cache.get(memberCounter.channel).permissionsFor(member.guild.members.me).has(perm)) {
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
            color: client.settings.embedColors.green,
            author: {
              name: `${member.user.tag} Katıldı!`,
              icon_url: member.user.displayAvatarURL({ size: 1024 }),
            },
            description: `📥 • **${memberCounter.target}** üye olmamıza **${memberCounter.target - member.guild.memberCount}** üye kaldı.`,
          };

          if (member.user.bot) joinEmbed.author.name = `${member.user.tag} Katıldı! (Bot 🤖)`;

          if (ortakSistem) {
            ortakSistem_embed.author = joinEmbed.author;
            ortakSistem_sayaç = joinEmbed.description;
          } else {
            member.guild.channels.cache.get(memberCounter.channel).send({
              embeds: [joinEmbed]
            });
          }

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
        }
      }
    }

    //Davet Sistemi
    if (inviteManager && inviteManager.channel) {

      try {

        client.logger.log(`DAVET SİSTEMİ TETİKLENDİ! • ${member.guild.name} (${member.guild.id})`);

        if (!member.guild.channels.cache.has(inviteManager.channel)) {

          client.logger.log(`Davet kanalı bulunamadı, sunucudaki davet sistemi sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
          db.delete(`guilds.${member.guild.id}.inviteManager.channel`);

          member.guild.channels.cache.get(inviteManager.setupInChannel)?.send({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Davet Kanalı Bulunamadığı İçin davet sistemi Sıfırlandı!',
                description: `**•** Tekrar ayarlamak için \`${prefix}davet-sistemi\` komutunu kullanabilirsiniz.`
              }
            ]
          });

        } else {

          const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];

          let clientPerms = [];

          botPermissions.forEach((perm) => {
            if (!member.guild.channels.cache.get(inviteManager.channel).permissionsFor(member.guild.members.me).has(perm)) {
              clientPerms.push(permissions[perm]);
            }
          });

          if (clientPerms.length > 0) {

            client.logger.log(`Davet kanalında bir/birkaç yetkim bulunmadığı için davet sistemi sıfırlanıyor... • ${member.guild.name} (${member.guild.id})`);
            db.delete(`guilds.${member.guild.id}.inviteManager.channel`);

            return member.guild.channels.cache.get(inviteManager.setupInChannel).send({
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


          } else {

            const cachedInvites = client.guildInvites.get(member.guild.id);
            const newInvites = await member.guild.invites.fetch();

            const usedInvite = newInvites.find(inv => cachedInvites?.get(inv.code) < inv.uses);
            //console.log("Cached", [...cachedInvites.keys()])
            //console.log("New", [...newInvites.values()].map(inv => inv.code))
            //console.log("Used", usedInvite)
            //console.log(`The code ${usedInvite.code} was just used by ${member.user.username}.`)

            let joinEmbed = {
              color: client.settings.embedColors.green,
              //title: `${usedInvite.url}`,
              author: {
                name: `${member.user.tag} Katıldı!`,
                icon_url: member.user.displayAvatarURL({ size: 1024 }),
              },
              //description: `📥 **${usedInvite.inviter.tag}** tarafından davet edildi.`
              //.setDescription(`${member.user.tag} is the ${member.guild.memberCount} to join.\nJoined using ${usedInvite.inviter.tag}\nNumber of uses: ${usedInvite.uses}`)
            };

            if (member.user.bot) joinEmbed.author.name = `${member.user.tag} Katıldı! (Bot 🤖)`;

            if (!usedInvite || member.user.bot) {
              joinEmbed.description = `📩 • Davet eden bulunamadı.`;
            } else {
              joinEmbed.description =
                `📩 • **${usedInvite.inviter.tag}** tarafından davet edildi. (**${(quikGuildData.inviteManager.invites?.[usedInvite.inviter.id]?.length || 0) + 1}** daveti bulunuyor.)`;

              //Davetçinin davet ettiği üyelere bu üyeyi pushlama 
              if (!inviteManager.invites || !inviteManager.invites[usedInvite.inviter.id] || !inviteManager.invites[usedInvite.inviter.id].includes(member.id))
                db.push(`guilds.${member.guild.id}.inviteManager.invites.${usedInvite.inviter.id}`, member.id);
            }

            if (ortakSistem) {
              ortakSistem_davet = joinEmbed.description;
            } else {
              member.guild.channels.cache.get(inviteManager.channel).send({
                embeds: [joinEmbed]
              });
            }

            newInvites.each(inv => cachedInvites?.set(inv.code, inv.uses));
            client.guildInvites.set(member.guild.id, cachedInvites);

          }
        }

      } catch (err) {
        client.logger.error(err);
      }
    }

    if (ortakSistem) {
      ortakSistem_embed.description = `${ortakSistem_sayaç}\n${ortakSistem_davet}`;
      ortakSistem_embed.color = client.settings.embedColors.green;
      member.guild.channels.cache.get(inviteManager.channel)?.send({
        embeds: [ortakSistem_embed]
      });
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