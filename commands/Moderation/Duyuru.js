module.exports = {
  interaction: {
    name: "duyuru",
    description: "Embed mesajı içerisinde bir duyuru yapar.",
    options: [
      {
        name: "metin",
        description: "Duyuru yapılacak metni gir.",
        type: 3,
        required: true
      },
    ]
  },
  aliases: [],
  category: "Moderation",
  memberPermissions: ["ManageMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    if (interaction.type == 2)
      var mesaj = interaction.options.getString("metin"),
        user = interaction.user;
    else
      var mesaj = args.slice(0).join(" "),
        user = interaction.author;

    if (mesaj.length < 1)
      return interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Duyuru Metni Belirtmelisin!',
            description: `**•** Örnek kullanım: \`/duyuru Nraphy'e vote atmayanları dövüyolarmıs!\``
          }
        ]
      });

    if (mesaj.length > 4000)
      return interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Duyuru Metni Çok Uzun!',
            description: `**•** Duyurun **4000** karakteri geçmemeli.`
          }
        ]
      });

    if (interaction.type == 2) await interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        title: "**»** Başarılı!",
        description: `**•** Duyuru mesajı gönderiliyor...`
      }],
      ephemeral: true
    });

    interaction.channel.send({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${interaction.guild.name} • Duyuru!`,
          icon_url: interaction.guild.iconURL(),
        },
        description: mesaj,
        timestamp: new Date().toISOString(),
        footer: {
          text: `${user.username} tarafından duyuruldu.`,
          icon_url: user.displayAvatarURL(),
        },
      }]
    });
  }
};