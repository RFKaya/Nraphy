const humanize = require("humanize-duration");

module.exports.removeAFK = async (client, message, userData) => {

  if (userData?.AFK?.time) {
    const { time, reason } = userData.AFK;

    let sürecik = Date.now() - time;

    if (sürecik > 1000) {

      let zaman = humanize(sürecik, { language: "tr", round: true, conjunction: ", ", serialComma: false });

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
                value: `**•** ${reason}`,
              },
              {
                name: '**»** AFK Olma Süresi',
                value: `**•** ${zaman}`,
              },
            ],
          }
        ]
      });

      userData.AFK = undefined;
      await userData.save();
    }
  }

};

module.exports.userIsAFK = async (client, message, userData) => {

  const { time, reason } = userData.AFK;

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
            value: `**•** ${humanize(Date.now() - time, { language: "tr", round: true, conjunction: ", ", serialComma: false })}`,
          },
        ],
      }
    ]
  }).then(msg => setTimeout(() => msg.delete(), 5000));

};