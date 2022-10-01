const Discord = require("discord.js");

module.exports = async (client, interaction) => {

  if (!interaction.guild) return interaction.reply({ content: ":x: | Etkileşim komutları maalesef DM'de kullanılamamaktadır." });

  if (interaction.type !== 2)
    client.logger.interaction(`${interaction.type} - customId: ${interaction.customId}`);

  if (interaction.type == 2)
    try {

      let cmd = client.commands.get(interaction.commandName);
      if (!cmd) return;

      let guildData = await client.database.fetchGuild(interaction.guild.id);

      const data = {};
      data.guild = guildData;
      //data.user = userData;
      data.cmd = cmd;
      data.prefix = guildData.prefix || client.settings.prefix;
      //data.premium = (userData.NraphyPremium && userData.NraphyPremium > Date.now());

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
        let userData = await client.database.fetchUser(interaction.user.id);
        let premium = data.premium = (userData.NraphyPremium && userData.NraphyPremium > Date.now());
        if (!(await topggapi.hasVoted(interaction.user.id)) && !premium) {
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

      let userPerms = [],
        clientPerms = [];

      cmd.memberPermissions.forEach((perm) => {
        if (!interaction.channel.permissionsFor(interaction.member).has(perm)) {
          userPerms.push(permissions[perm]);
        }
      });
      cmd.botPermissions.forEach((perm) => {
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(perm)) {
          clientPerms.push(permissions[perm]);
        }
      });

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

      let cmdCooldown = cmd.cooldown || 1000;

      let cmdLastUsage = client.userDataCache[interaction.user.id].lastCmds[cmd.interaction.name] || 0;
      if (cmdLastUsage && ((cmdLastUsage + cmdCooldown) > Date.now())) {
        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.red,
            description: `**»** Bu komutu tekrar kullanabilmen için **${Math.ceil(((cmdLastUsage + cmdCooldown) - Date.now()) / 1000)} saniye** beklemelisin.`
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
};