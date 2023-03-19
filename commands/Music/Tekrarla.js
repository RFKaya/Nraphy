module.exports = {
  interaction: {
    name: "tekrarla",
    description: "Mevcut şarkıyı veya sırayı durmadan tekrar çalar.",
    options: [
      {
        name: "tekrar",
        description: "Tekrarlama modunun sırayı ya da mevcut şarkıyı tekrarlayacağını belirt.",
        choices: [
          { name: "Mevcut şarkı", value: "sarki" },
          { name: "Tüm sıra", value: "sira" },
          { name: "Kapat", value: "kapat" }
        ],
        type: 3,
        required: true
      },
    ]
  },
  interactionOnly: true,
  aliases: ['lp', 'repeat', "loop", "döngü"],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    if (!interaction.member.voice.channel)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Bir odada değilsin. Herhangi bir odaya geç ve tekrar dene!"
        }]
      });

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Aynı odada değiliz! Bulunduğum odaya katıl ve tekrar dene!"
        }]
      });

    const queue = client.distube.getQueue(interaction.guild);

    if (!queue || !queue.songs || queue.songs.length == 0)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Şu anda bir şarkı çalmıyor."
        }]
      });

    const choice = interaction.options.getString("tekrar");

    if (choice == 'sarki') {
      queue.setRepeatMode(1);
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.green,
          title: "**»** Tekrarlama Modu Etkinleştirildi!",
          description: "**•** Mevcut şarkı durmadan tekrarlanacak."
        }]
      });
    } else if (choice == 'sira') {
      if (queue.songs.length <= 1) {
        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.red,
            title: "**»** Sırada Bir Şarkı Bulunmuyor!",
            description: '**•** Fakat istersen sadece çalan şarkıyı tekrarlatabilirsin.'
          }]
        });
      } else {
        queue.setRepeatMode(2);
        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.green,
            title: "**»** Tekrarlama Modu Etkinleştirildi!",
            description: "**•** Mevcut sıradaki şarkılar durmadan tekrarlanacak."
          }]
        });
      }
    } else if (choice == 'kapat') {
      if (queue.repeatMode == 0) {
        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.red,
            description: "**»** Tekrarlama modu zaten kapalı."
          }]
        });
      } else {
        queue.setRepeatMode(0);
        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.green,
            description: "**»** Tekrarlama modu devre dışı bırakıldı."
          }]
        });
      }
    }
  },
};