module.exports = {
  interaction: {
    name: "bağış",
    description: "Bot geliştiricisine yemek ısmarlamanız için yardımcı olur.",
    options: []
  },
  aliases: [],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Canın Sağ Olsun Kardeeş! 💖',
          description: '**•** Valla ihtiyaç yok, düşünmen yeterli 😇',
        }
      ],
    })

  }
};