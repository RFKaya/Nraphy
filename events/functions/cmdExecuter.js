const Discord = require("discord.js");
const permissions = require("../../utils/Permissions.json");

module.exports = async (client, interaction, cmd, guildData, userData, args = null) => {

  try {

    const user = interaction.type === 2 ? interaction.user : interaction.author;

    //---------------Owner Only---------------//
    if (cmd.ownerOnly && user.id !== client.settings.owner) return;

    //---------------General Cooldown---------------//
    const userDataCache = client.userDataCache[user.id] || (client.userDataCache[user.id] = {});
    if (userDataCache.lastMessage && Date.now() - userDataCache.lastMessage < 700)
      return;
    userDataCache.lastMessage = Date.now();

    //---------------Data---------------//
    const data = {
      guild: guildData,
      user: userData,
      cmd: cmd,
      prefix: guildData.prefix || client.settings.prefix,
      premium: (userData.NraphyPremium && userData.NraphyPremium > Date.now()),
      guildIsBoosted: (guildData.NraphyBoost?.users?.length ? true : false)
    };

    //---------------Permissions---------------//
    let
      missingMemberPerms = (cmd.memberPermissions || [])
        .filter(perm => !interaction.channel.permissionsFor(interaction.member).has(perm)),
      missingClientPerms = [...new Set(["SendMessages", "ReadMessageHistory", "EmbedLinks", ...(cmd.botPermissions || [])])]
        .filter(perm => !interaction.channel.permissionsFor(interaction.guild.members.me).has(perm));

    if (missingClientPerms.length) {

      let
        missingClientPermsEmbedMessage = {
          embeds: [
            {
              color: client.settings.embedColors.red,
              author: {
                name: `Bu Komutu Çalıştırabilmem İçin Gereken İzinlere Sahip Değilim!`,
                icon_url: interaction.guild.iconURL(),
              },
              fields: [
                {
                  name: '**»** İhtiyacım Olan İzinler;',
                  value: `**•** ${missingClientPerms.map(perm => permissions[perm]).join("\n**•** ")}`,
                },
              ]
            }
          ],
          ephemeral: true
        },
        missingClientPermsMessage = {
          content:
            "**»** Bu komutu çalıştırabilmem için aşağıdaki izinlere ihtiyacım var!\n\n" +
            `**•** ${missingClientPerms.map(perm => permissions[perm]).join("\n**•** ")}`,
          ephemeral: true
        };

      if (missingClientPerms.includes("SendMessages"))
        return user.send(missingClientPermsEmbedMessage);

      else if (missingClientPerms.includes("ReadMessageHistory")) {
        return interaction.channel.send(missingClientPerms.includes("EmbedLinks") ? missingClientPermsMessage : missingClientPermsEmbedMessage);
      }

      else if (missingClientPerms.includes("EmbedLinks"))
        return interaction.reply(missingClientPermsMessage);

      else return interaction.reply(missingClientPermsEmbedMessage);

    }

    if (missingMemberPerms.length)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            description: `**»** Bu komutu kullanabilmek için **${missingMemberPerms.map(perm => permissions[perm])}** yetkisine sahip olmalısın.`
          }
        ],
        ephemeral: true
      });

    //---------------Interaction Only---------------//
    if (cmd.interactionOnly && interaction.type !== 2)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: `**»** Bu Komut Yalnızca Slash Komutu Olarak Kullanılabilir!`,
            description: `**•** Kullanmak için \`/${cmd.interaction.name}\` yazmalısın.`,
          }
        ]
      });

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
    if (cmd.voteRequired && client.config.topggToken) {

      let topgg = require(`@top-gg/sdk`);
      let topggapi = new topgg.Api(client.config.topggToken);

      //Topgg API bozuksa
      const topggStatus = client.clientDataCache.topggStatus;
      if (!topggStatus.status) {
        client.logger.log(`${(interaction.user || interaction.author).id} kullanıcısına vote muaf verildi.`, "log", true, true);

        if (Date.now() - topggStatus.lastCheck > 900000) {
          topggapi.hasVoted(user.id)
            .then(data => topggStatus = ({ status: true, lastCheck: Date.now() }))
            .catch(error => topggStatus = ({ status: false, lastCheck: Date.now() }));
        }
      }

      //Topgg API çalışıyorsa
      else if (!data.premium && !(await topggapi.hasVoted(user.id)
        .catch(error => {
          client.logger.error(`Topgg Error: "${error}" - 15 dakikalığına topgg api muaf aktif edildi!`);
          topggStatus = ({ status: false, lastCheck: Date.now() });
        })
      )) {
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

    //---------------Cooldown---------------//
    const userDataCache_lastCmds = userDataCache.lastCmds || (userDataCache.lastCmds = {});
    const userDataCache_lastCmds_thisCmd = userDataCache_lastCmds[(cmd.interaction || cmd).name] || 0;

    const cmdCooldown = data.premium ? (cmd.cooldown || 1000) / (3 / 2) : cmd.cooldown || 1000;

    if (userDataCache_lastCmds_thisCmd && ((userDataCache_lastCmds_thisCmd + cmdCooldown) > Date.now())) {
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description:
            data.premium ?
              `**»** Bu komutu tekrar kullanabilmen için **${Math.ceil((userDataCache_lastCmds_thisCmd + cmdCooldown - Date.now()) / 1000)} saniye** beklemelisin.`
              :
              `**»** Bu komutu tekrar kullanabilmen için **${Math.ceil((userDataCache_lastCmds_thisCmd + cmdCooldown - Date.now()) / 1000)} saniye** beklemelisin.\n` +
              `**•** Nraphy Premium ile bekleme sürelerini kısaltabilirsin. \`/premium Bilgi\``
        }],
        ephemeral: true
      });
    }

    userDataCache_lastCmds[(cmd.interaction || cmd).name] = Date.now();

    //---------------Logging & Stats---------------//
    client.logger.cmdLog(user, interaction.guild, interaction.type === 2 ? "interaction" : "message", (cmd.interaction || cmd).name, interaction.type === 0 ? interaction.content : null);

    //---------------CMD Execute---------------//
    if (interaction.type === 2)
      await cmd.execute(client, interaction, data);
    else {
      if (cmd.interaction) {
        await cmd.execute(client, interaction, data, args);
      } else {
        await cmd.execute(client, interaction, args, data);
      }
    }

  } catch (err) { client.logger.error(err); };
};
