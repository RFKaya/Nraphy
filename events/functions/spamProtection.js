module.exports = async (client, message, spamProtection) => {

  try {

    const LIMIT = 6;
    const TIME = 11000;

    if (message.author.bot && !message.member?.moderatable) return;

    //O kanalda spam koruması çalışacak mı?
    if (!spamProtection.guild) return;

    //Muaflar
    if (

      (!spamProtection.exempts || (
        //Kanal Muaf
        (!spamProtection.exempts.channels?.length || !spamProtection.exempts.channels.includes(message.channel.id)) &&

        //Rol Muaf
        (!spamProtection.exempts.roles?.length || !message.member.roles.cache.map(map => map.id).some(role => spamProtection.exempts.roles.includes(role)))
      )) &&

      //ManageMessages Yetki Muaf
      !message.member.permissions.has("ManageMessages")

    ) {

      let fn = setTimeout(() => {
        const userDatake = client.usersMap.get(message.author.id);
        userDatake.msgCount -= 1;
      }, TIME);

      if (!client.usersMap.has(message.author.id)) {

        client.usersMap.set(message.author.id, {
          msgCount: 1,
          timer: fn
        });

      } else {

        const userDatake = client.usersMap.get(message.author.id);
        ++userDatake.msgCount;

        if (parseInt(userDatake.msgCount) >= LIMIT) {
          if (!client.warnsMap.get(message.author.id)) {
            client.warnsMap.set(message.author.id, true);
            message.reply({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  author: {
                    name: `${message.author.username}, spam yapmayı kes!`,
                    icon_url: message.author.displayAvatarURL(),
                  },
                  footer: {
                    text: 'Spam yapmaya devam edersen susturulacaksın.',
                    icon_url: client.settings.icon,
                  },
                }
              ]
            }).then(async msg => {
              while (true) {
                await client.wait(1500);
                const userDatake = client.usersMap.get(message.author.id);
                if (userDatake.msgCount < 1) {
                  client.warnsMap.set(message.author.id, false);
                  msg.delete();
                  break;
                }
              }
            });
          }
        }

        if (parseInt(userDatake.msgCount) >= (LIMIT + 5)) {
          //message.reply("dur sana bi mute atim de gör.");
          message.member.timeout(60000, "Nraphy Bot • Spam Koruması")
            .then(message.channel.send({
              embeds: [
                {
                  color: client.settings.embedColors.red,
                  author: {
                    name: `${message.author.username}, spam yaptığın için susturuldun! 🛡️`,
                    icon_url: message.author.displayAvatarURL(),
                  }
                }
              ]
            }))
            //.then(msg => setTimeout(() => { msg.delete() }, 30000))
            .catch(error => {
              client.logger.error(error);
            });
        }
      }
    }

  } catch (err) { client.logger.error(err); };
};
