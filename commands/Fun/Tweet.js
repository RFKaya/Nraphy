const fetch = require('node-fetch');

module.exports = {
  interaction: {
    name: "tweet",
    description: "Kendi adınıza sahte bir tweet atarsınız.",
    options: [
      {
        name: "yazı",
        description: "Tweet'inde yazmasını istediğini yaz.",
        type: 3,
        required: true
      }
    ]
  },
  aliases: ["twitter"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    const text = interaction.type === 2 ? interaction.options.getString("yazı") : args.join(" ");

    const { messageChecker } = require("../../modules/Functions");
    if (!await messageChecker(interaction, text, "tweet Nraphy öz botumdur!")) return;

    if (interaction.type === 2) await interaction.deferReply();

    const response = await fetch(`https://nekobot.xyz/api/imagegen?type=tweet&text=${encodeURI(text).replaceAll('#', '%23')}&username=${encodeURI((interaction.type === 2 ? interaction.user : interaction.author).username)}&raw=512`);
    const responseData = await response.json();

    if (!responseData.success) {
      client.logger.error("TWEET komutunda bir sorun oluştu kardeeş.");
      client.logger.log(responseData);

      let messageContent = {
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Hata Oluştu!',
            description: `**•** Hatanın sebebini bilmiyorum.`
          }
        ]
      };
      if (interaction.type === 2)
        return interaction.editReply(messageContent);
      else return interaction.reply(messageContent);
    }

    let messageContent = {
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${client.user.username} • Tweet (Twitter)`,
            icon_url: client.settings.icon,
          },
          image: {
            url: responseData.message,
          }
        }
      ]
    };
    if (interaction.type === 2)
      return interaction.editReply(messageContent);
    else return interaction.reply(messageContent);

  }
};