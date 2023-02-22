const humanize = require("humanize-duration");

module.exports = {
  name: "emoji-bilgi",
  description: "Emoji hakkında bilgi verir.",
  usage: "emoji-bilgi",
  aliases: ["emojiinfo", "emojibilgi", "emojinfo", "emoji-info"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, message, args, data) {

    let emojiname = args[0];

    if (!emojiname) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bir Emoji, Adı ya da ID\'si Girmelisin!',
          description: `**•** Örnek kullanım: \`${data.prefix}emoji-bilgi <Emoji/ID/İsim>\``
        }
      ]
    });

    const emoji =
      message.guild.emojis.cache.find(emoji => emoji.name.toLowerCase() === `${emojiname.toLowerCase()}`) ||
      message.guild.emojis.cache.find(emoji => emoji.id === `${emojiname}`) ||
      message.guild.emojis.cache.find(emoji => `<:${emoji.name}:${emoji.id}>` == `${emojiname}`);

    if (!emoji) return message.channel.send({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** Bir Emoji Adı ya da ID\'si Girmelisin!',
          description: `**•** Örnek kullanım: \`${data.prefix}emoji-bilgi NraphyLogo\``
        }
      ]
    });

    var timestamp = Date.now() - emoji.createdAt.getTime();
    var oluşturulmatarihi = humanize(timestamp, { language: "tr", round: true, largest: 4 });

    message.channel.send({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${client.user.username} • Emoji Bilgi`,
          icon_url: client.settings.icon,
        },
        title: `**»** ${emoji.name}`,
        thumbnail: {
          url: emoji.url,
        },
        fields: [
          {
            name: "**»** ID",
            value: `**•** ${emoji.id}`,
            inline: false,
          },
          {
            name: "**»** Emoji Bağlantısı",
            value: `**•** ${emoji.url}`,
            inline: false,
          },
          {
            name: "**»** Oluşturulma Tarihi",
            value: `**•** <t:${(emoji.createdAt.getTime() / 1000).toFixed(0)}:f> • (\`${oluşturulmatarihi}\`)`,
            inline: false,
          },
        ]
      }]
    });

  }
};