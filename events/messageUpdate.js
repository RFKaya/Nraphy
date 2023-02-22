module.exports = async (client, oldMessage, newMessage) => {

  if (!newMessage.guild) return;
  if (newMessage.author.bot) return;

  const guildData = await client.database.fetchGuild(newMessage.guild.id);

  try {

    const linkBlock = guildData.linkBlock;

    if (linkBlock && newMessage.content) {

      //O kanalda reklam engelleme çalışacak mı?
      if (linkBlock.guild || linkBlock.channels?.includes(newMessage.channel.id)) {

        //Muaflar
        if (

          (!linkBlock.exempts || (
            //Kanal Muaf
            (!linkBlock.exempts.channels?.length || !linkBlock.exempts.channels.includes(newMessage.channel.id)) &&

            //Rol Muaf
            (!linkBlock.exempts.roles?.length || !newMessage.member.roles.cache.map(map => map.id).some(role => linkBlock.exempts.roles.includes(role)))
          )) &&

          //ManageMessages Yetki Muaf
          !newMessage.member.permissions.has("ManageMessages")

        ) {

          const reklam = ["discord.gg", "http://", "https://", "www.", ".com", ".net", ".xyz"];
          const messageContent = newMessage.content.toLowerCase()
            .replace(' ', "")
            .replace('https://tenor.com', "")
            .replace('https://c.tenor.com', "")
            .replace('https://giphy.com', "")
            .replace('https://media.giphy.com', "")
            .replace('https://gibir.net.tr', "");

          if (reklam.some(word => messageContent.includes(word))) {
            newMessage.delete().catch(e => { });

            //---------------Warner---------------//

            const userCache = client.userDataCache[newMessage.author.id] || (client.userDataCache[newMessage.author.id] = {});
            if (!userCache.lastWarn || (userCache.lastWarn + 5000) < Date.now()) {
              userCache.lastWarn = Date.now();
              newMessage.channel.send({
                embeds: [
                  {
                    color: client.settings.embedColors.red,
                    author: {
                      name: `${newMessage.author.username}, mesajını düzenleyerek bu sunucuda reklam yapabileceğini mi sandın?`,
                      icon_url: newMessage.author.displayAvatarURL(),
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

    //CapsLock Block
    //client.logger.log(`CAPSLOCK-ENGEL TETİKLENDİ! • ${message.guild.name} (${message.guild.id})`);
    require("./functions/upperCaseBlock.js")(client, newMessage, guildData);

  } catch (err) {
    client.logger.error(err);
    console.log(newMessage);
  };

};