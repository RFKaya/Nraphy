module.exports = async (client, messages) => {

  let referenceMessage = messages.first();

  if (!referenceMessage.guild) return;

  const guildData = await client.database.fetchGuild(referenceMessage.guild.id);

  let logger = guildData.logger;
  if (!logger?.webhook) return;

  try {

    //Message Executor
    let messageExecutor;
    let fetchedLogs = await referenceMessage.guild.fetchAuditLogs({
      limit: 1,
      type: 73,
    });
    let log = fetchedLogs.entries.first();
    if (log) messageExecutor = log.executor;

    //Mesaj içerikleri
    let messageContents = [];
    messages.forEach(message => {
      if (message.author.bot)
        return; //messageContents.push(`[${message.author.tag} (Bot)]: \`(Mesaj İçeriği Gösterilmiyor)\``);
      if (message.content)
        messageContents.push(`[${message.author.tag}]: ${message.content}`);
      else
        messageContents.push(`[${message.author.tag}]: \`(Mesaj İçeriği Yok)\``);
    });
    messageContents.reverse();

    //Pages
    let embeds = [];
    let maxPage = Math.ceil(messageContents.join('\n').length / 4000);
    for (let page = 0; page < maxPage; page++) {

      await embeds.push({
        color: client.settings.embedColors.red,
        title: `**»** \`#${referenceMessage.guild.channels.cache.get(referenceMessage.channelId).name}\` kanalında **${messages.size}** mesaj silindi!`,
        description:
          `${messageContents.length !== messages.size ? `**•** Bot tarafından gönderilmiş **${messages.size - messageContents.length}** adet mesaj filtrelendi.\n` : ""}` +
          messageContents.join('\n').substring(page * 4000, 4000 + (page * 4000)),
        timestamp: new Date(),
        footer: {
          text: `${messageExecutor ? `${messageExecutor.tag} tarafından silindi. • Sayfa ${page + 1}/${maxPage}` : `Silen kullanıcı bulunamadı.`}`,
          icon_url: messageExecutor ? messageExecutor.displayAvatarURL() : client.settings.icon,
        },
      });
    }

    //Logging
    require('../functions/logManager')(client, guildData, { embeds: embeds });

  } catch (err) { require('../functions/logManager').errors(client, guildData, err); };
};
