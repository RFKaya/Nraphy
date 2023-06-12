module.exports = async (client, message, linkBlock, isEditEvent = false) => {

  try {

    //O kanalda reklam engelleme çalışacak mı?
    if (!linkBlock.guild) return;

    //Muaflar
    if (

      (!linkBlock.exempts || (
        //Kanal Muaf
        (!linkBlock.exempts.channels?.length || !linkBlock.exempts.channels.includes(message.channel.id)) &&

        //Rol Muaf
        (!linkBlock.exempts.roles?.length || !message.member.roles.cache.map(map => map.id).some(role => linkBlock.exempts.roles.includes(role)))
      )) &&

      //ManageMessages Yetki Muaf
      !message.member.permissions.has("ManageMessages")

    ) {

      const reklam = ["discord.gg", "http://", "https://", "www.", ".com", ".net", ".xyz"];
      const messageContent = message.content.toLowerCase()
        .replace(' ', "")
        .replace('https://tenor.com', "")
        .replace('https://c.tenor.com', "")
        .replace('https://giphy.com', "")
        .replace('https://media.giphy.com', "")
        .replace('https://gibir.net.tr', "");


      if (reklam.some(word => messageContent.includes(word))) {
        message.delete().catch(e => { });

        //---------------Warner---------------//

        const userCache = client.userDataCache[message.author.id] || (client.userDataCache[message.author.id] = {});
        if (!userCache.lastWarn || (userCache.lastWarn + 5000) < Date.now()) {
          userCache.lastWarn = Date.now();
          message.channel.send({
            embeds: [
              {
                color: client.settings.embedColors.red,
                author: {
                  name:
                    isEditEvent
                      ? `${message.author.username}, mesajını düzenleyerek reklam yapabileceğini mi sandın?`
                      : `${message.author.username}, bu sunucuda reklam yapamazsın!`,
                  icon_url: message.author.displayAvatarURL(),
                },
              }
            ]
          }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 5000));
        }

        //---------------Warner---------------//

      }
    }

  } catch (err) { client.logger.error(err); };
};