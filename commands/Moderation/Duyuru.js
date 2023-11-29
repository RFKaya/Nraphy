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
      {
        name: "başlık",
        description: "Anket metninin başlığını gir.",
        type: 3,
        required: false
      },
      {
        name: "herkesten-bahset",
        description: "@everyone'dan bahsedilsin mi?",
        choices: [
          { name: "Herkesten (@everyone) bahset!", value: "true" },
          { name: "Bahsetme (Varsayılan)", value: "false" },
        ],
        type: 3,
        required: false
      },
    ]
  },
  interactionOnly: true,
  category: "Moderation",
  memberPermissions: ["ManageMessages", "MentionEveryone"],
  botPermissions: ["SendMessages", "EmbedLinks", "MentionEveryone"],
  cooldown: 3000,

  async execute(client, interaction, data) {

    const mesaj = interaction.options.getString("metin"),
      title = interaction.options.getString("başlık"),
      pingEveryone = interaction.options.getString("herkesten-bahset");

    if (mesaj.length < 1)
      return interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Bir Duyuru Metni Belirtmelisin!',
            description: `**•** Örnek kullanım: \`/duyuru kanove'ye vote atmayanları dövüyolarmıs!\``
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

    if (title && title.length > 250)
      return interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Duyuru Başlığı Çok Uzun!',
            description: `**•** Başlık **250** karakteri geçmemeli.`
          }
        ]
      });

    await interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        title: "**»** Başarılı!",
        description: `**•** Duyuru mesajı gönderiliyor...`
      }],
      ephemeral: true
    });

    return await interaction.channel.send({
      content: pingEveryone === "true" ? "@everyone" : null,
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${interaction.guild.name} • Duyuru!`,
            icon_url: interaction.guild.iconURL(),
          },
          title: title || null,
          description: mesaj,
          timestamp: new Date().toISOString(),
          footer: {
            text: `${interaction.user.username} tarafından duyuruldu.`,
            icon_url: interaction.user.displayAvatarURL(),
          },
        }
      ]
    });
  }
};