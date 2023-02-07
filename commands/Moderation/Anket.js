module.exports = {
  interaction: {
    name: "anket",
    description: "Embed mesajı içerisinde bir anket yapar.",
    options: [
      {
        name: "metin",
        description: "Anket yapılacak metni gir.",
        type: 3,
        required: true
      },
    ]
  },
  aliases: ["oylama"],
  category: "Moderation",
  memberPermissions: ["ManageMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
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
            title: '**»** Bir Anket Metni Belirtmelisin!',
            description: `**•** Örnek kullanım: \`/anket YaGo'nun kafasına taşla vurmalı mıyım?\``
          }
        ]
      });

    if (mesaj.length > 4000)
      return interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Anket Metni Çok Uzun!',
            description: `**•** Metnin **4000** karakteri geçmemeli.`
          }
        ]
      });

    if (interaction.type == 2) await interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        title: "**»** Başarılı!",
        description: `**•** Anket mesajı gönderiliyor...`
      }],
      ephemeral: true
    });

    interaction.channel.send({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${interaction.guild.name} • Anket!`,
          icon_url: interaction.guild.iconURL(),
        },
        description: mesaj,
        timestamp: new Date().toISOString(),
        footer: {
          text: `${user.username} tarafından yapıldı.`,
          icon_url: user.displayAvatarURL(),
        },
      }]
    }).then(async message => {
      await message.react('<:evetcik:618420600901206026>');
      await message.react('<:hayircik:618420671466438656>');
    });
  }
};