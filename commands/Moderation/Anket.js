module.exports = {
  interaction: {
    name: "anket",
    description: "Embed mesajı içerisinde bir anket yapar.",
    options: [
      {
        name: "başlık",
        description: "Anketin başlığını gir.",
        type: 3,
        required: true
      },
      {
        name: "açıklama",
        description: "Anketin açıklamasını gir.",
        type: 3,
        required: true
      },
      {
        name: "seçenekler",
        description: "Seçenekler arasına virgül ekleyerek seçenekleri belirt.",
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
  aliases: ["oylama"],
  category: "Moderation",
  memberPermissions: ["ManageMessages", "MentionEveryone"],
  botPermissions: ["AddReactions", "MentionEveryone"],
  cooldown: 3000,

  async execute(client, interaction, data) {

    const title = interaction.options.getString("başlık"),
      description = interaction.options.getString("açıklama"),
      options = interaction.options.getString("seçenekler"),
      pingEveryone = interaction.options.getString("herkesten-bahset");
    const optionsArray = options?.split(',').filter(v => v);

    if (description.length > 2000)
      return interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Açıklaman Çok Uzun!',
            description: `**•** Metnin **2000** karakteri geçmemeli.`
          }
        ]
      });

    if (title && title.length > 250)
      return interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Anket Başlığı Çok Uzun!',
            description: `**•** Başlık **250** karakteri geçmemeli.`
          }
        ]
      });

    if (options && options.length > 1000)
      return interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Seçeneklerin Toplamda 1000 Karakteri Geçmemeli!',
            description: `**•** Beni aşıyor, kusuruma bakma canım.`
          }
        ]
      });

    if (options && optionsArray.length < 2)
      return interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** En Az 2 Seçenek Belirtmelisin!',
            description: `**•** Ya da istersen seçenekleri boş bırakabilirsin.`
          }
        ]
      });

    if (options && optionsArray.length > 9)
      return interaction.channel.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** En Fazla 9 Seçenek Belirtebilirsin!',
            description: `**•** Bu yükü kaldıramam ben kardeeeş.`
          }
        ]
      });

    await interaction.reply({
      embeds: [{
        color: client.settings.embedColors.green,
        title: "**»** Başarılı!",
        description: `**•** Anket mesajı gönderiliyor...`
      }],
      ephemeral: true
    });

    const mapping = {
      1: '1️⃣',
      2: '2️⃣',
      3: '3️⃣',
      4: '4️⃣',
      5: '5️⃣',
      6: '6️⃣',
      7: '7️⃣',
      8: '8️⃣',
      9: '9️⃣',
    };

    return await interaction.channel.send({
      content: pingEveryone === "true" ? "@everyone" : null,
      embeds: [
        {
          color: client.settings.embedColors.default,
          author: {
            name: `${interaction.guild.name} • Anket!`,
            icon_url: interaction.guild.iconURL(),
          },
          title: title || null,
          description: `${description}${options ? `\n\n${optionsArray.map((option, index) => `${mapping[index + 1]} ${option}`).join('\n')}` : ""}`,
          timestamp: new Date().toISOString(),
          footer: {
            text: `${interaction.user.username} tarafından yapıldı.`,
            icon_url: interaction.user.displayAvatarURL(),
          },
        }
      ]
    }).then(async message => {

      if (!options) {
        await message.react('👍');
        await message.react('👎');
      } else {
        for await (let option of optionsArray.map((option, index) => index)) {
          await message.react(mapping[option + 1]);
          await client.wait(500);
        }
      }

    });
  }
};