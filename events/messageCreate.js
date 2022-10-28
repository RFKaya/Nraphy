const Discord = require("discord.js");
const db = require("quick.db");
const lastWarn = {};

module.exports = async (client, message) => {

  if (!message.guild) return;
  if (!message.channel) return;
  if (message.author.bot) return;

  const guildData = await client.database.fetchGuild(message.guild.id);
  const quikGuildData = await db.fetch(`guilds.${message.guild.id}`);

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

    } /*else if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {

      let soruSorCmd = client.commands.get("soru-sor");
      let soruSorArgs = message.content.slice(message.content.startsWith(`<@!${client.user.id}>`) ? `<@!${client.user.id}>`.length : `<@${client.user.id}>`.length).trim().split(/ +/g);

      soruSorCmd.execute(client, message, { prefix }, soruSorArgs);

      client.logger.cmdLog(message.author, message.guild, "message", soruSorCmd.interaction.name, message.content);
    }*/

  } catch (err) { client.logger.error(err); };
};
