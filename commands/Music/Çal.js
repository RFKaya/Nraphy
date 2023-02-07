module.exports = {
  interaction: {
    name: "çal",
    description: "Bağlantısını veya adını girdiğiniz şarkıyı/oynatma listesini çalar.",
    options: [
      {
        name: "şarkı",
        description: "Bir şarkı adı ya da bağlantısı gir.",
        type: 3,
        required: true
      },
    ]
  },
  aliases: ["play", "p", "oynat", "ç", "oynat"],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

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

    const music = interaction.type == 2 ? interaction.options.getString("şarkı") : args.join(' ');

    if (interaction.type == 2) await interaction.deferReply();

    const searchResult = await client.player
      .search(music, {
        requestedBy: interaction.user || interaction.author
      })
      .catch((err) => {
        client.logger.error(err);
      });

    if (!searchResult || !searchResult.tracks.length) {
      let message = {
        embeds: [{
          color: client.settings.embedColors.red,
          description: `**»** **${music}** şeklinde bir şarkı bulunamadı.`
        }],
      };

      if (interaction.type == 2)
        return interaction.editReply(message);
      else return interaction.reply(message);
    }

    const queue = await client.player.createQueue(interaction.guild, {
      metadata: { channel: interaction.channel },
      bufferingTimeout: 1000,
      disableVolume: false, // disabling volume controls can improve performance
      leaveOnEnd: true,
      leaveOnStop: true,
      spotifyBridge: false,
      //leaveOnEmpty: true, // not working for now, discord-player issue
      //leaveOnEmptyCooldown: 300000,
    });

    // verify vc connection
    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();

      let message = {
        embeds: [{
          color: client.settings.embedColors.red,
          title: `**»** Bir Hata Oluştu!`,
          description: `**•** Sesli odanıza katılamadım. Tekrar dene.`,
        }]
      };
      if (interaction.type == 2)
        return interaction.editReply(message);
      else return interaction.reply(message);
    }

    let message = {
      embeds: [{
        color: client.settings.embedColors.default,
        description: `**»** ${searchResult.playlist ? 'Oynatma listesi (Beta)' : 'Şarkı'} başlatılıyor... 🎵`
      }],
    };
    if (interaction.type == 2)
      interaction.editReply(message);
    else interaction.reply(message);

    searchResult.playlist ? queue.addTracks(searchResult.tracks) : /*queue.addTrack*/queue.play(searchResult.tracks[0]);
    //if (!queue.playing) await queue.play();

    if (!interaction.guild.members.me.voice.channel) {
      await queue.connect(interaction.member.voice.channel);
      queue.play();
    }

  },
};