const humanize = require("humanize-duration");

module.exports = {
  name: "stres-çarkı",
  description: "Stres çarkı çevirir.",
  aliases: ['stresçarkı', 'fidgetspin', 'fidgetspinner', 'handspin', 'handspinner', "çark"],
  category: "Games",
  cooldown: 10000,

  async execute(client, message, args, data) {

    message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${message.author.username} bir stres çarkı çevirdi!`,
            icon_url: message.author.avatarURL(),
          },
          image: {
            url: 'https://i.imgur.com/KJJxVi4.gif',
          },
        }
      ]
    }).then(mesaj => {
      let süre = (Math.random() * 200 * 1000).toFixed(0);
      setTimeout(() => {
        mesaj.edit({
          embeds: [
            {
              color: client.settings.embedColors.default,
              title: `**»** Stres çarkın **${humanize(süre, { language: "tr", round: true })}** döndü!`,
              author: {
                name: `${message.author.username} bir stres çarkı çevirdi!`,
                icon_url: message.author.avatarURL(),
              },
            }
          ]
        });
      }, süre / 20);
    });
  }
};