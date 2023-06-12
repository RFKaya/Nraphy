var request = require("request");

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

    request(`https://nekobot.xyz/api/imagegen?type=tweet&text=${encodeURI(text)}&username=${encodeURI((interaction.type === 2 ? interaction.user : interaction.author).username)}&raw=512`, function (error, response, body) {

      if (error || !body || !JSON.parse(body).success) {
        client.logger.error(error);

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
        else return interaction.edit(messageContent);
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
              url: JSON.parse(body).message,
            }
          }
        ]
      };
      if (interaction.type === 2)
        return interaction.editReply(messageContent);
      else return interaction.reply(messageContent);

    });

  }
};