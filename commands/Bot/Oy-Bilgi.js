module.exports = {
  interaction: {
    name: "oy-bilgi",
    description: "Oy verme hakkında tüm bilgileri verir.",
    options: []
  },
  aliases: ["oybilgi"],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Oy verme sayfasına gitmek için buraya tıkla!',
          url: "https://top.gg/bot/700959962452459550/vote",
          author: {
            name: `${client.user.username} • Oy Verme Hakkında`,
            icon_url: client.settings.icon,
          },
          fields: [
            {
              name: '**»** Oy Nasıl Verilir?',
              value: `**•** \`${data.prefix}oy-ver\` yazarak ya da yukarıdaki mavi yazıya tıklayarak botun oy verme sayfasına gidebilir, oradaki "vote" yazan butona tıklayıp oy verebilirsiniz.`,
            },
            {
              name: '**»** Oy Verdim Fakat Hâlâ Oy Vermemi İstiyor.',
              value: '**•** Oylar sisteme anında işlenir. Oy verdiğiniz hesap ile komutu kullandığınız hesabın aynı olmasına dikkat edin.',
            },
            {
              name: '**»** Neden Oy İsteniyor?',
              value: '**•** Botun daha fazla kitleye ulaşması için yardımcı bir unsur.',
            },
          ],
          /*timestamp: new Date(),
          footer: {
            text: `${(interaction.type == 2) ? interaction.user.username : interaction.author.username} tarafından istendi.`,
            icon_url: (interaction.type == 2) ? interaction.user.displayAvatarURL() : interaction.author.displayAvatarURL(),
          },*/
        }
      ],
    });

  }
};