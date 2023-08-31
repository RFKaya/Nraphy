const humanize = require("humanize-duration");

module.exports = {
  interaction: {
    name: "emoji-bilgi",
    description: "Seçtiğiniz emoji hakkında bilgi verir.",
    options: [
      {
        name: "emoji",
        description: "Bir emoji adı ya da ID'si gir.",
        type: 3,
        required: false
      },
    ]
  },
  aliases: ["emojiinfo", "emojibilgi", "emojinfo", "emoji-info"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    const emojiname = interaction.type === 2 ? interaction.options.getString("emoji") : args[0];
    if (!emojiname)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Emoji Adı ya da ID\'si Girmelisin!',
            description: `**•** Örnek kullanım: \`/emoji-bilgi <Emoji/İsim/ID>\``
          }
        ]
      });

    const emoji =
      interaction.guild.emojis.cache.find(emoji => emoji.name.toLowerCase() === `${emojiname.toLowerCase()}`) ||
      interaction.guild.emojis.cache.find(emoji => emoji.id === `${emojiname}`) ||
      interaction.guild.emojis.cache.find(emoji => `<:${emoji.name}:${emoji.id}>` === `${emojiname}` || `<a:${emoji.name}:${emoji.id}>` === `${emojiname}`);

    if (!emoji)
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Sunucuda Bulunan Bir Emoji Adı ya da ID\'si Girmelisin!',
            description: `**•** Örnek kullanım: \`/emoji-bilgi NraphyLogo\``
          }
        ]
      });

    return await interaction.reply({
      embeds: [
        {
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
              value: `**•** <t:${(emoji.createdAt.getTime() / 1000).toFixed(0)}:f> • (\`${humanize(Date.now() - emoji.createdAt.getTime(), { language: "tr", round: true, largest: 4 })}\`)`,
              inline: false,
            },
          ]
        }
      ]
    });

  }
};