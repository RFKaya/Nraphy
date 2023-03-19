module.exports = async (client, oldMessage, newMessage) => {

  if (!newMessage.guild) return;

  const guildData = await client.database.fetchGuild(newMessage.guild.id);

  let logger = guildData.logger;
  if (!logger?.webhook) return;

  try {

    if (!oldMessage.content || !newMessage.content || (oldMessage.content == newMessage.content)) return;

    //Embed
    let embedDescription = `**Önceki:** ${oldMessage.content}\n**Sonraki:** ${newMessage.content}`;
    if (embedDescription.length > 4096) return;
    let embed = {
      color: client.settings.embedColors.red,
      author: {
        name: `${newMessage.author.tag} (ID: ${newMessage.author.id})`,
        icon_url: newMessage.author.displayAvatarURL()
      },
      title: `**»** \`#${newMessage.guild.channels.cache.get(newMessage.channelId).name}\` kanalında bir mesaj düzenledi!`,
      url: newMessage.url,
      description: embedDescription,
      /*timestamp: new Date(),
      footer: {
          text: `${messageExecutor.tag} tarafından silindi.`,
          icon_url: messageExecutor.displayAvatarURL(),
      },*/
    };

    //Logging
    require('../functions/logManager')(client, guildData, { embeds: [embed] });

  } catch (err) { require('../functions/logManager').errors(client, guildData, err); };
};
