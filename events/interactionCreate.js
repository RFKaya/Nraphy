const Discord = require("discord.js");

module.exports = async (client, interaction) => {

  if (!interaction.guild) return interaction.reply({ content: ":x: | Etkileşim komutları maalesef DM'de kullanılamamaktadır." });

  if (interaction.type !== 2)
    client.logger.interaction(`user: ${interaction.user.tag} (${interaction.user.id}), type: ${interaction.type}, customId: ${interaction.customId}`);

  if (interaction.type == 2)
    try {

      let cmd = client.commands.get(interaction.commandName);
      if (!cmd) return;

      var guildData = await client.database.fetchGuild(interaction.guild.id);
      var userData = await client.database.fetchUser(interaction.user.id);

      const data = {};
      data.guild = guildData;
      data.user = userData;
      data.cmd = cmd;
      data.prefix = guildData.prefix || client.settings.prefix;
      data.premium = (userData.NraphyPremium && userData.NraphyPremium > Date.now());

      //---------------NSFW---------------//
      if (cmd.nsfw && !interaction.channel.nsfw) {
        return interaction.reply({
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
      }

      //---------------Vote---------------//
      if (cmd.voteRequired) {
        let topgg = require(`@top-gg/sdk`);
        let topggapi = new topgg.Api(client.config.topggToken);
        if (!data.premium && !(await topggapi.hasVoted(interaction.user.id))) {
          return interaction.reply({
            embeds: [{
              color: client.settings.embedColors.red,
              title: '**»** Bu Komutu Kullanmak İçin **TOP.GG** Üzerinden Oy Vermelisin!',
              url: 'https://top.gg/bot/700959962452459550/vote',
              description:
                `**•** Oy vermek için aşağıdaki butonu kullanabilir ya da mesaj başlığına tıklayabilirsin.\n` +
                `**•** Ya da en iyisi Nraphy Premium abonesi olabilirsin. \`/premium Bilgi\``,
            }],
            components: [
              {
                type: 1, components: [
                  new Discord.ButtonBuilder().setLabel('Oy Bağlantısı (TOP.GG)').setURL("https://top.gg/bot/700959962452459550/vote").setStyle('Link')
                ]
              },
            ],
            ephemeral: true
          });
        }
      }

      //---------------Permissions---------------//
      const permissions = require("../utils/Permissions.json");

      let
        userPerms = cmd.memberPermissions
          .filter(perm => !interaction.channel.permissionsFor(interaction.member).has(perm))
          .map(perm => permissions[perm]),
        clientPerms = cmd.botPermissions
          .filter(perm => !interaction.channel.permissionsFor(interaction.guild.members.me).has(perm))
          .map(perm => permissions[perm]);

      if (userPerms.length > 0) {
        if (clientPerms.includes("Bağlantı Yerleştir")) {
          return interaction.reply({
            content: `Bu komutu kullanabilmek için ` + userPerms.map((p) => `**${p}**` + " yetkisine sahip olmalısın.").join(", "),
            ephemeral: true
          });
        } else {
          return interaction.reply({
            embeds: [{
              color: client.settings.embedColors.red,
              description: `**»** Bu komutu kullanabilmek için ` + userPerms.map((p) => `**${p}**` + " yetkisine sahip olmalısın.").join(", ")
            }],
            ephemeral: true
          });
        }
      }

      if (clientPerms.length > 0) {
        if (clientPerms.includes("Mesaj Gönder")) {

          return interaction.user.send({
            embeds: [{
              color: client.settings.embedColors.red,
              author: {
                name: `Bu Komutu Çalıştırabilmem İçin Gereken İzinlere Sahip Değilim!`,
                icon_url: interaction.guild.iconURL(),
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
          return interaction.reply({ content: "Bu komutu çalıştırabilmem için aşağıdaki izinlere ihtiyacım var!\n\n" + "**•** " + clientPerms.map((p) => `${p}`).join("\n**•** ") });
        } else {
          return interaction.reply({
            embeds: [{
              color: client.settings.embedColors.red,
              author: {
                name: `Bu Komutu Çalıştırabilmem İçin Gereken İzinlere Sahip Değilim!`,
                icon_url: interaction.guild.iconURL(),
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

      //---------------Cooldown---------------//
      if (!client.userDataCache[interaction.user.id]?.lastCmds) {
        if (!client.userDataCache[interaction.user.id]) {
          client.userDataCache[interaction.user.id] = {};
        }
        client.userDataCache[interaction.user.id].lastCmds = {};
      }

      let cmdCooldown = data.premium ? (cmd.cooldown || 1000) / (3 / 2) : cmd.cooldown || 1000;

      let cmdLastUsage = client.userDataCache[interaction.user.id].lastCmds[cmd.interaction.name] || 0;
      if (cmdLastUsage && ((cmdLastUsage + cmdCooldown) > Date.now())) {
        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.red,
            description:
              data.premium ?
                `**»** Bu komutu tekrar kullanabilmen için **${Math.ceil((cmdLastUsage + cmdCooldown - Date.now()) / 1000)} saniye** beklemelisin.`
                :
                `**»** Bu komutu tekrar kullanabilmen için **${Math.ceil((cmdLastUsage + cmdCooldown - Date.now()) / 1000)} saniye** beklemelisin.\n` +
                `**•** Nraphy Premium ile bekleme sürelerini kısaltabilirsin. \`/premium Bilgi\``
          }],
          ephemeral: true
        });
      }

      client.userDataCache[interaction.user.id].lastCmds[cmd.interaction.name] = Date.now();

      //---------------Logging & Stats---------------//
      //client.logger.interactionCmd(`${interaction.user.tag} (${interaction.user.id}) => ${client.capitalizeFirstLetter(cmd.interaction.name, "tr")} => ${interaction.guild.name} (${interaction.guild.id})`);
      client.logger.cmdLog(interaction.user, interaction.guild, "interaction", cmd.interaction.name, null);

      //---------------CMD Execute---------------//
      await cmd.execute(client, interaction, data);

    } catch (err) { client.logger.error(err); }

  else if (interaction.type == 3)
    try {

      if (interaction.componentType == 2) {

        let guildData = await client.database.fetchGuild(interaction.guild.id);

        /*//Geçici Kanallar
        if (interaction.customId === "tempChannels_deleteChannel") {
          client.logger.log(`GEÇİCİ KANALLAR TETİKLENDİ! (KANAL SİLME İŞLEMİ) • ${interaction.guild.name} (${interaction.guild.id})`);
          require("./functions/tempChannels.js").deleteChannel(client, interaction, guildData);
        }*/

        //Buton-Rol
        if (Object.keys(guildData.buttonRole || {}).length && guildData.buttonRole[interaction.message.id]) {
          client.logger.log(`BUTON-ROL TETİKLENDİ! • ${interaction.guild.name} (${interaction.guild.id})`);
          require("./functions/buttonRole.js")(client, interaction, guildData);
        }
      }

    } catch (err) { client.logger.error(err); };

};