module.exports = async (client, oldMessage, newMessage) => {

  if (!newMessage.guild) return;
  if (newMessage.author.bot) return;

  const guildData = await client.database.fetchGuild(newMessage.guild.id);

  try {

    const linkBlock = guildData.linkBlock;
    if (linkBlock && newMessage.content)
      require("./functions/linkBlock")(client, newMessage, linkBlock, true);

    //CapsLock Block
    //client.logger.log(`CAPSLOCK-ENGEL TETİKLENDİ! • ${message.guild.name} (${message.guild.id})`);
    require("./functions/upperCaseBlock.js")(client, newMessage, guildData);

  } catch (err) {
    client.logger.error(err);
    console.log(newMessage);
  };

};