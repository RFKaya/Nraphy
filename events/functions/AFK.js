const humanize = require("humanize-duration");

module.exports.removeAFK = async (client, message, userCacheData) => {

  const userData = await client.database.fetchUser(userCacheData.userId);

  const sürecik = Date.now() - userData.AFK.time;
  if (sürecik > 1000) {

    if (message.member.moderatable) message.member.setNickname(message.member.displayName.replace("[AFK]", ""), ["Nraphy AFK Sistemi"]);

    message.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${message.author.username}, artık AFK değil!`,
            icon_url: message.author.avatarURL(),
          },
          fields: [
            {
              name: '**»** AFK Olma Sebebi',
              value: `**•** ${userData.AFK.reason}`,
            },
            {
              name: '**»** AFK Olma Süresi',
              value: `**•** ${humanize(sürecik, { language: "tr", round: true, conjunction: ", ", serialComma: false })}`,
            },
          ],
        }
      ]
    });


    userData.AFK = undefined;
    await userData.save();
  }

};

module.exports.userIsAFK = async (client, message, mentionUserCacheData) => {

  const { time, reason } = mentionUserCacheData.AFK;

  let user = message.mentions.users.first();

  message.reply({
    embeds: [
      {
        color: client.settings.embedColors.red,
        author: {
          name: `${user.username} kullanıcısı şu an AFK!`,
          icon_url: user.avatarURL(),
        },
        fields: [
          {
            name: '**»** AFK Olma Sebebi',
            value: `**•** ${reason}`,
          },
          {
            name: '**»** AFK Olma Süresi',
            value: `**•** ${humanize(Date.now() - Date.parse(time), { language: "tr", round: true, conjunction: ", ", serialComma: false })}`,
          },
        ],
      }
    ]
  }).then(msg => setTimeout(() => msg.delete(), 5000));

};