module.exports = async (client, message) => {

  if (!message.guild) return;
  if (message.author.bot) return;

  const guildData = await client.database.fetchGuild(message.guild.id);

  let logger = guildData.logger;
  if (!logger?.webhook) return;

  try {

    //Message Executor
    let fetchedLogs = await message.guild.fetchAuditLogs({
      limit: 1,
      type: 72,
    });
    let log = ((Date.now() - fetchedLogs.entries.first()?.createdAt.getTime()) < 5000)
      ? fetchedLogs.entries.first()
      : null;
    let messageExecutor = log?.executor || message.author;

    //Attachments
    let attachments = [];
    if (message.attachments) message.attachments.forEach(attachment => {
      attachments.push(`[${attachment.name}](${attachment.url})`);
    });

    if (!message.content && attachments.length == 0) return;

    //Embed
    let embed = {
      color: client.settings.embedColors.red,
      author: {
        name: `${message.author.tag} (ID: ${message.author.id})`,
        icon_url: message.author.displayAvatarURL()
      },
      title: `**»** \`#${message.guild.channels.cache.get(message.channelId).name}\` kanalında bir mesaj silindi!`,
      description: message.content,
      timestamp: new Date(),
      footer: {
        text: `${messageExecutor.tag} tarafından silindi.`,
        icon_url: messageExecutor.displayAvatarURL(),
      },
    };
    if (attachments.length > 0) embed.fields = [
      {
        name: '**»** Dosyalar',
        value: `**•** ${attachments.join(`\n**•** `)}`,
      },
    ];

    //Logging
    require('../functions/logManager')(client, guildData, { embeds: [embed] });

  } catch (err) { require('../functions/logManager').errors(client, guildData, err); };
};
