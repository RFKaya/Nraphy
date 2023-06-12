const Discord = require("discord.js");
const { ButtonBuilder, WebhookClient } = require('discord.js');

module.exports = async (client, message, guildData) => {

  try {

    const upperCaseBlock = guildData.upperCaseBlock;

    //Sadece eklenti içeren görselleri görmeme
    if (!message.content) return;

    //Üst yetkiliyi muaf kılma
    if (!message.member?.moderatable) return;

    //O kanalda büyük harf engel çalışacak mı?
    if (!upperCaseBlock.guild) return;

    //ManageMessages Yetki Muaf
    if (message.member.permissions.has("ManageMessages")) return;

    //Muaflar
    if (upperCaseBlock.exempts && (

      //Kanal Muaf
      (
        upperCaseBlock.exempts.channels &&
        upperCaseBlock.exempts.channels.length != 0 &&
        upperCaseBlock.exempts.channels.includes(message.channel.id)
      ) ||

      //Rol Muaf
      (
        upperCaseBlock.exempts.roles &&
        upperCaseBlock.exempts.roles.length != 0 &&
        message.member.roles.cache.map(map => map.id).some(role => upperCaseBlock.exempts.roles.includes(role))
      )

    )) return;

    //text tanımlama ve boşlukları silme
    let text = message.content.replace(/\s/g, '');

    //2 ve daha az karakterli mesajları görmeme
    if (text.length < 3) return;

    let upperCase = 0;

    var i = text.length;
    while (i--) {
      //if (/^[A-Z]*$/.test(text.charAt(i))) upperCase++; else lowerCase++;
      //if (text.charAt(i).toUpperCase() == text.charAt(i)) upperCase++; else lowerCase++;
      if (/[ABCÇDEFGHİIJKLMNOÖPRSŞTUÜVYZQWX]+/.test(text.charAt(i))) upperCase++;
    }

    if ((upperCase / text.length * 100) < (guildData.upperCaseBlock.rate || 70)) return;

    message.delete().catch(e => { });

    //---------------Warner---------------//

    const userCache = client.userDataCache[message.author.id] || (client.userDataCache[message.author.id] = {});

    if (!userCache?.lastWarn || Date.now() - userCache.lastWarn > 5000) {
      userCache.lastWarn = Date.now();
      message.channel.send({
        content: message.author.toString(),
        embeds: [
          {
            color: client.settings.embedColors.red,
            author: {
              name: `${message.author.username}, mesajın çok fazla BÜYÜK HARF içeriyor!`,
              icon_url: message.author.displayAvatarURL(),
            },
          }
        ]
      }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 5000));
    }

    //---------------Warner---------------//

  } catch (err) { client.logger.error(err); };
};
