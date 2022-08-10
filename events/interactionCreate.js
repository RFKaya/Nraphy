const Discord = require("discord.js");

const cmdCooldown = {};

module.exports = async (client, interaction) => {

  if (!interaction.guild) return interaction.reply({ content: ":x: | Etkileşim komutları maalesef DM'de kullanılamamaktadır." });

  if (interaction.type !== "APPLICATION_COMMAND")
    client.logger.interaction(`${interaction.type} - customId: ${interaction.customId}`);

  if (interaction.type == "APPLICATION_COMMAND")
    try {

      let guildData = await client.database.fetchGuild(interaction.guild.id);

      let prefix = guildData.prefix || client.settings.prefix;

      const cmd = client.commands.get(interaction.commandName);

      if (cmd) {

        const data = {};
        data.guild = guildData;
        //data.user = userData;
        data.cmd = cmd;
        data.prefix = prefix;
        //data.premium = (userData.NraphyPremium && userData.NraphyPremium > Date.now());

        if (cmd.nsfw && !interaction.channel.nsfw) {
          return interaction.reply({
            embeds: [
              {
                color: "RED",
                title: '**»** Bu Komutu Yalnızca NSFW Kanallarda Kullanabilirsin!',
                description: `**•** Kanal ayarlarından **Yaş Sınırlı Kanal** seçeneğini aktif etmelisin.`,
                image: {
                  url: 'https://media.discordapp.net/attachments/767040721890312215/987277932084994158/unknown.png',
                },
              }
            ]
          });
        }

        if (cmd.voteRequired) {
          let topgg = require(`@top-gg/sdk`);
          let topggapi = new topgg.Api(client.config.topggToken);
          if (!(await topggapi.hasVoted(interaction.user.id)) && !data.premium) {
            return interaction.reply({
              embeds: [{
                color: "RED",
                title: '**»** Bu Komutu Kullanmak İçin **TOP.GG** Üzerinden Oy Vermelisin!',
                url: 'https://top.gg/bot/700959962452459550/vote',
                description:
                  `**•** Oy vermek için aşağıdaki butonu kullanabilir ya da mesaj başlığına tıklayabilirsin.\n` +
                  `**•** Ya da en iyisi Nraphy Premium abonesi olabilirsin. \`/premium Bilgi\``,

              }],
              components: [
                {
                  type: 1, components: [
                    new Discord.MessageButton().setLabel('Oy Bağlantısı (TOP.GG)').setURL("https://top.gg/bot/700959962452459550/vote").setStyle('LINK')
                  ]
                },
              ],
              ephemeral: true
            });
          }
        }

        const permissions = require("../utils/Permissions.json");

        let userPerms = [];

        cmd.memberPermissions.forEach((perm) => {
          if (!interaction.channel.permissionsFor(interaction.member).has(perm)) {
            userPerms.push(permissions[perm]);
          }
        });

        let clientPerms = [];

        cmd.botPermissions.forEach((perm) => {
          if (!interaction.channel.permissionsFor(interaction.guild.me).has(perm)) {
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
                color: "RED",
                description: `**»** Bu komutu kullanabilmek için ` + userPerms.map((p) => `**${p}**` + " yetkisine sahip olmalısın.").join(", ")
              }],
              ephemeral: true
            });
          }
        }

        if (clientPerms.length > 0) {
          if (clientPerms.includes("Mesaj Gönder")) {

            return interaction.reply({
              embeds: [{
                color: "RED",
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
                color: "RED",
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

        let userCooldown = cmdCooldown[interaction.user.id];

        if (!userCooldown) {
          cmdCooldown[interaction.user.id] = {};
          uCooldown = cmdCooldown[interaction.user.id];
        }

        let time = uCooldown[cmd.interaction.name] || 0;
        //Check if user has a command cooldown
        if (time && (time > Date.now())) {
          let timeLeft = Math.ceil((time - Date.now()) / 1000);
          return interaction.reply({
            embeds: [{
              color: "RED",
              description: `**»** Bu komutu tekrar kullanabilmen için **${timeLeft} saniye** beklemelisin.`
            }],
            ephemeral: true
          });
        }

        let cmdCooldownDuration = cmd.cooldown || 800;

        cmdCooldown[interaction.user.id][cmd.interaction.name] = Date.now() + cmdCooldownDuration;

        client.logger.interactionCmd(`${interaction.user.tag} (${interaction.user.id}) => ${client.capitalizeFirstLetter(cmd.interaction.name, "tr")} => ${interaction.guild.name} (${interaction.guild.id})`);

        cmd.execute(client, interaction, data);//, args, data)

        let userData = await client.database.fetchUser(interaction.user.id);
        userData.commandUses += 1;
        await userData.save();

        let clientData = await client.database.fetchClientData(global.clientDataId);
        if (!clientData.commandUses[cmd.interaction.name])
          clientData.commandUses[cmd.interaction.name] = 1; else
          clientData.commandUses[cmd.interaction.name] += 1;
        clientData.markModified(`commandUses.${cmd.interaction.name}`);
        await clientData.save();
      }

    } catch (err) { client.logger.error(err); }
};
