const Discord = require("discord.js");
const db = require("quick.db");
const lastWarn = {};

module.exports = async (client, message) => {

  if (!message.guild) return;
  if (!message.channel) return;
  if (message.author.bot) return;

  const guildData = await client.database.fetchGuild(message.guild.id);

  const prefix = guildData.prefix || client.settings.prefix;

  const userCache = client.userDataCache[message.author.id] || (client.userDataCache[message.author.id] = {});

  try {

    //MessageStats
    /*if (message.guild.id === "532991144112554005") {
      var nowDate = new Date();
      var date = `${nowDate.getFullYear()}.${(nowDate.getMonth() + 1)}.${nowDate.getDate()}`;
      console.log(date)
    }*/

    //Commands
    if (message.content.toLowerCase().startsWith(prefix.toLowerCase())) {

      //---------------General Cooldown---------------//
      if (userCache.lastMessage && Date.now() - userCache.lastMessage < 700)
        return;
      userCache.lastMessage = Date.now();

      //Checking if the message is a command
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const commandName = args.shift().toLowerCase();
      const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases?.includes(commandName));
      if (!cmd) return;

      const data = {
        guild: guildData,
        //user: userData,
        cmd,
        prefix
        //premium: userData.NraphyPremium && userData.NraphyPremium > Date.now();
      };

      //---------------NSFW---------------//
      if (cmd.nsfw && !message.channel.nsfw)
        return message.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** Bu Komutu Yalnızca NSFW Kanallarda Kullanabilirsin!',
              description: `**•** Kanal ayarlarından **Yaş Sınırlı Kanal** seçeneğini aktif etmelisin.`,
              image: {
                url: 'https://media.discordapp.net/attachments/767040721890312215/987277932084994158/unknown.png',
              },
            }
          ]
        });


      //---------------Owner Only---------------//
      if (cmd.ownerOnly && message.author.id !== client.settings.owner) return; //message.channel.send("Bu komut Rauq abime özeldir!");

      //---------------Permissions---------------//
      const permissions = require("../utils/Permissions.json");

      let
        userPerms = cmd.memberPermissions
          .filter(perm => !message.channel.permissionsFor(message.member).has(perm))
          .map(perm => permissions[perm]),
        clientPerms = cmd.botPermissions
          .filter(perm => !message.channel.permissionsFor(message.guild.members.me).has(perm))
          .map(perm => permissions[perm]);


      if (userPerms.length > 0) {
        if (clientPerms.includes("Bağlantı Yerleştir")) {
          return message.channel.send({
            content: `Bu komutu kullanabilmek için ` + userPerms.map((p) => `**${p}**` + " yetkisine sahip olmalısın.").join(", ")
          });
        } else {
          return message.channel.send({
            embeds: [{
              color: client.settings.embedColors.red,
              description: `**»** Bu komutu kullanabilmek için ` + userPerms.map((p) => `**${p}**` + " yetkisine sahip olmalısın.").join(", ")
            }]
          });
        }
      }

      if (clientPerms.length > 0) {
        if (clientPerms.includes("Mesaj Gönder")) {

          return message.author.send({
            embeds: [{
              color: client.settings.embedColors.red,
              author: {
                name: `Bu Komutu Çalıştırabilmem İçin Gereken İzinlere Sahip Değilim!`,
                icon_url: message.guild.iconURL(),
              },
              fields: [
                {
                  name: '**»** İhtiyacım Olan İzinler;',
                  value: "**•** " + clientPerms.map((p) => `${p}`).join("\n**•** "),
                },
              ]
            }]
          });

        } else if (clientPerms.includes("Bağlantı Yerleştir")) {
          return message.channel.send({ content: "Bu komutu çalıştırabilmem için aşağıdaki izinlere ihtiyacım var!\n\n" + "**•** " + clientPerms.map((p) => `${p}`).join("\n**•** ") });
        } else {
          return message.channel.send({
            embeds: [{
              color: client.settings.embedColors.red,
              author: {
                name: `Bu Komutu Çalıştırabilmem İçin Gereken İzinlere Sahip Değilim!`,
                icon_url: message.guild.iconURL(),
              },
              fields: [
                {
                  name: '**»** İhtiyacım Olan İzinler;',
                  value: "**•** " + clientPerms.map((p) => `${p}`).join("\n**•** "),
                },
              ]
            }]
          });
        }
      }

      //---------------Interaction Only---------------//
      if (cmd.interactionOnly)
        return message.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: `**»** Bu Komut Yalnızca Slash Komutu Olarak Kullanılabilir!`,
              description: `**•** Kullanmak için \`/${cmd.interaction.name}\` yazmalısın.`,
            }
          ]
        });

      {

        //---------------Command Cooldown---------------//

        let cmdCooldown = cmd.cooldown || 1000;

        const userCacheLastCmds = userCache.lastCmds || (userCache.lastCmds = {});

        let cmdLastUsage = userCacheLastCmds[cmd.name || cmd.interaction.name] || null;
        if (cmdLastUsage && cmdLastUsage + cmdCooldown > Date.now())
          return message.reply({
            embeds: [{
              color: client.settings.embedColors.red,
              description: `**»** Bu komutu tekrar kullanabilmen için **${Math.ceil((cmdLastUsage + cmdCooldown - Date.now()) / 1000)} saniye** beklemelisin.`
            }],
          });

        userCacheLastCmds[cmd.name || cmd.interaction.name] = Date.now();

        //---------------Logging & Stats---------------//
        client.logger.cmdLog(message.author, message.guild, "message", (cmd.name || cmd.interaction.name), message.content);

        //---------------CMD Execute---------------//
        if (cmd.interaction) {
          await cmd.execute(client, message, data, args);
        } else {
          await cmd.execute(client, message, args, data);
        }
      }
    }

    //Bağlantı Engel
    const linkBlock = guildData.linkBlock;

    if (linkBlock && message.content) {

      //O kanalda reklam engelleme çalışacak mı?
      if (linkBlock.guild || linkBlock.channels?.includes(message.channel.id)) {

        //Muaflar
        if (

          (!linkBlock.exempts || (
            //Kanal Muaf
            (!linkBlock.exempts.channels || linkBlock.exempts.channels.length == 0 || !linkBlock.exempts.channels.includes(message.channel.id)) &&

            //Rol Muaf
            (!linkBlock.exempts.roles || linkBlock.exempts.roles.length == 0 || !message.member.roles.cache.map(map => map.id).some(role => linkBlock.exempts.roles.includes(role)))
          )) &&

          //ManageMessages Yetki Muaf
          !message.member.permissions.has("ManageMessages")

        ) {

          const reklam = ["discord.gg", "http://", "https://", "www.", ".com", ".net", ".xyz"];
          const messageContent = message.content.toLowerCase()
            .replace(' ', "")
            .replace('https://tenor.com', "")
            .replace('https://c.tenor.com', "")
            .replace('https://giphy.com', "")
            .replace('https://media.giphy.com', "")
            .replace('https://gibir.net.tr', "");


          if (reklam.some(word => messageContent.includes(word))) {
            message.delete();

            //---------------Warner---------------//

            if (!userCache.lastWarn || (userCache.lastWarn + 5000) < Date.now()) {
              userCache.lastWarn = Date.now();
              message.channel.send({
                embeds: [
                  {
                    color: client.settings.embedColors.red,
                    author: {
                      name: `${message.author.username}, bu sunucuda reklam yapamazsın!`,
                      icon_url: message.author.displayAvatarURL(),
                    },
                  }
                ]
              }).then(msg => setTimeout(() => msg.delete(), 5000));
            }

            //---------------Warner---------------//

          }
        }
      }
    }

    //Galeri
    let gallery = guildData.gallery;

    if (
      //Galeri açıksa ve o kanal galeri kanalıysa
      message.channel.id == gallery &&

      //Mesaj sahibi kanalları yönet yetkisine sahip değilse
      !message.channel.permissionsFor(message.member).has("ManageChannels") &&

      //Mesaj eklenti içeriyormiyorsa
      !message.attachments.size) {

      let repliedMessage;
      if (message.reference) await message.channel.messages.fetch(message.reference.messageId).then(repliedMsg => repliedMessage = repliedMsg);

      //Alıntılanmış yoksa ya da alıntılanmış mesajın eklentisi yoksa
      if (!repliedMessage || repliedMessage.attachments.size == 0) {

        message.delete({ reason: `Bu kanalda yalnızca görsel paylaşılabilir. Bu sistemi kapatmak istiyorsanız, "${prefix}galeri sıfırla" yazmanız yeterlidir.` });

        let time = 5000 - (Date.now() - lastWarn[message.author.id]);
        lastWarn[message.author.id] = Date.now();
        if (!time || time <= 0)
          message.channel.send({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Bu Kanalda Sadece **Fotoğraf/Video** Paylaşabilirsin!',
                description: `**•** Sistemi kapatmak için \`${prefix}galeri\` komutunu kullanabilirsin.`
              }
            ]
          }).then(msg => setTimeout(() => { msg.delete(); }, 5000));


      }
    }

    //Spam Koruması

    const spamProtection = guildData.spamProtection;
    if (spamProtection && message.content) {

      const LIMIT = 6;
      const TIME = 11000;

      if (!message.author.bot && message.member?.moderatable) {

        //O kanalda spam koruması çalışacak mı?
        if (spamProtection.guild || spamProtection.channels?.includes(message.channel.id)) {

          //Muaflar
          if (

            (!spamProtection.exempts || (
              //Kanal Muaf
              (!spamProtection.exempts.channels || spamProtection.exempts.channels.length == 0 || !spamProtection.exempts.channels.includes(message.channel.id)) &&

              //Rol Muaf
              (!spamProtection.exempts.roles || spamProtection.exempts.roles.length == 0 || !message.member.roles.cache.map(map => map.id).some(role => spamProtection.exempts.roles.includes(role)))
            )) &&

            //ManageMessages Yetki Muaf
            !message.member.permissions.has("ManageMessages")

          ) {

            let fn = setTimeout(() => {
              const userDatake = client.usersMap.get(message.author.id);
              userDatake.msgCount -= 1;
            }, TIME);

            if (!client.usersMap.has(message.author.id)) {

              client.usersMap.set(message.author.id, {
                msgCount: 1,
                timer: fn
              });

            } else {

              const userDatake = client.usersMap.get(message.author.id);
              ++userDatake.msgCount;

              if (parseInt(userDatake.msgCount) >= LIMIT) {
                if (!client.warnsMap.get(message.author.id)) {
                  client.warnsMap.set(message.author.id, true);
                  message.reply({
                    embeds: [
                      {
                        color: client.settings.embedColors.red,
                        author: {
                          name: `${message.author.username}, spam yapmayı kes!`,
                          icon_url: message.author.displayAvatarURL({ size: 1024 }),
                        },
                        footer: {
                          text: 'Spam yapmaya devam edersen susturulacaksın.',
                          icon_url: client.settings.icon,
                        },
                      }
                    ]
                  }).then(async msg => {
                    while (true) {
                      await client.wait(1500);
                      const userDatake = client.usersMap.get(message.author.id);
                      if (userDatake.msgCount < 1) {
                        client.warnsMap.set(message.author.id, false);
                        msg.delete();
                        break;
                      }
                    }
                  });
                }
              }

              if (parseInt(userDatake.msgCount) >= (LIMIT + 5)) {
                //message.reply("dur sana bi mute atim de gör.");
                message.member.timeout(60000, "Nraphy Bot • Spam Koruması")
                  .then(message.channel.send({
                    embeds: [
                      {
                        color: client.settings.embedColors.red,
                        author: {
                          name: `${message.author.username}, spam yaptığın için susturuldun! 🛡️`,
                          icon_url: message.author.displayAvatarURL({ size: 1024 }),
                        }
                      }
                    ]
                  }))
                  //.then(msg => setTimeout(() => { msg.delete() }, 30000))
                  .catch(error => {
                    client.logger.error(error);
                  });
              }
            }
          }
        }
      }
    }

    //CapsLock Block
    //client.logger.log(`CAPSLOCK-ENGEL TETİKLENDİ! • ${message.guild.name} (${message.guild.id})`);
    require("./functions/upperCaseBlock.js")(client, message, guildData);

    //Kelime Oyunu
    var wordGame = guildData?.wordGame;
    if (wordGame?.channel === message.channel.id) {
      client.logger.log(`KELİME-OYUNU TETİKLENDİ! • ${message.guild.name} (${message.guild.id})`);
      require("./functions/wordGame.js")(client, message, wordGame, guildData);
    }

    if (userCache.lastMessage && Date.now() - userCache.lastMessage < 2000)
      return;
    userCache.lastMessage = Date.now();

    //Prefixim & Soru-Sor
    if (message.content.toLowerCase() === `<@!${client.user.id}>` || message.content.toLowerCase() === `<@${client.user.id}>`) {

      message.channel.send({
        embeds: [{
          color: client.settings.embedColors.default,
          description: `**»** Prefixim \`${prefix}\` • \`${prefix}komutlar\` yazarak tüm komutlara ulaşabilirsin.`
        }]
      });

    } else if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {

      let soruSorCmd = client.commands.get("soru-sor");
      let soruSorArgs = message.content.slice(message.content.startsWith(`<@!${client.user.id}>`) ? `<@!${client.user.id}>`.length : `<@${client.user.id}>`.length).trim().split(/ +/g);

      soruSorCmd.execute(client, message, { prefix }, soruSorArgs);

      client.logger.cmdLog(message.author, message.guild, "message", soruSorCmd.interaction.name, message.content);
    }

    const userData = await client.database.fetchUser(message.author.id, false);

    //AFK
    if (userData?.AFK?.time) {
      client.logger.log(`AFK SİSTEMİ TETİKLENDİ! • ${message.guild.name} (${message.guild.id})`);
      require("./functions/AFK.js").removeAFK(client, message, userData);
    }
    if (message.mentions.users.first()) {
      let mentionUserData = await client.database.fetchUser(message.mentions.users.first().id, false);
      if (mentionUserData?.AFK?.time) {
        client.logger.log(`AFK SİSTEMİ TETİKLENDİ! • ${message.guild.name} (${message.guild.id})`);
        require("./functions/AFK.js").userIsAFK(client, message, mentionUserData);
      }
    }

  } catch (err) { client.logger.error(err); };
};
