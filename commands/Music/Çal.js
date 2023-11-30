module.exports = {
  interaction: {
    name: "çal",
    description: "Adını veya bağlantısını girdiğiniz şarkıyı/oynatma listesini çalar.",
    options: [
      {
        name: "şarkı",
        description: "Bir şarkı adı ya da bağlantısı gir.",
        type: 3,
        required: true
      },
    ]
  },
  aliases: ["play", "p", "oynat", "ç", "oynat", "şarkı"],
  category: "Music_Player",
  botPermissions: ["SendMessages", "EmbedLinks", "AddReactions"],
  cooldown: 5000,

  async execute(client, interaction, data, args) {

    const channel = interaction.member.voice.channel;
    if (!channel)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Bir odada değilsin. Herhangi bir odaya geç ve tekrar dene!"
        }]
      });

    if (interaction.guild.members.me.voice.channel && channel.id !== interaction.guild.members.me.voice.channel.id)
      return interaction.reply({
        embeds: [{
          color: client.settings.embedColors.red,
          description: "**»** Aynı odada değiliz! Bulunduğum odaya katıl ve tekrar dene!"
        }]
      });

    const queue = client.player.useQueue(interaction.guildId);

    const query = interaction.type === 2 ? interaction.options.getString("şarkı") : args.join(' ');

    const isValidUrl = urlString => {
      try {
        return Boolean(new URL(urlString));
      } catch (e) {
        return false;
      }
    };

    if (isValidUrl(query)) {
      const musicURL = new URL(query);

      if (["youtube.com", "youtu.be"].some(url => musicURL.host.includes(url))) {
        if (!data.guildIsBoosted)
          return interaction.reply({
            embeds: [{
              color: client.settings.embedColors.red,
              description:
                `**»** YouTube bağlantıları geçici olarak desteklenmemektedir.`
            }]
          });

      } else if (!["spotify.com", "soundcloud.com"].some(url => musicURL.host.includes(url)))
        return interaction.reply({
          embeds: [{
            color: client.settings.embedColors.red,
            description:
              `**»** Bağlantılarda yalnızca Spotify/SoundCloud bağlantıları geçerlidir.`
          }]
        });
    }

    if (interaction.type === 2)
      await interaction.deferReply();
    else await interaction.react('✅').catch(() => { });

    try {

      if (queue?.node.isPaused()) queue.node.setPaused(false);

      const { track } = await client.player.play(channel, query, {
        blockExtractors: ["YouTubeExtractor"],
        nodeOptions: {
          metadata: { channel: interaction.channel, interaction },
          maxSize: data.guildIsBoosted ? Infinity : 200
        },
        requestedBy: interaction.type == 2 ? interaction.user : interaction.author,
        fallbackSearchEngine: "soundcloud"
      });

      //sourceString
      const getSourceString = function (uri) {
        if (!uri) return null;
        else if (uri?.includes("soundcloud")) return "SoundCloud";
        else if (uri?.includes("spotify")) return "Spotify";
        else if (uri?.includes("youtube")) return "YouTube";
        else return "Diğer";
      },
        metadata = await track.__reqMetadataFn(),
        mainSource = getSourceString(metadata.source?.uri || metadata?.uri || metadata.source),
        bridgeSource = getSourceString(metadata.bridge?.uri);

      const embed = {
        color: client.settings.embedColors.default,
        title: `**»** ${track.playlist ? `${track.playlist.title} Oynatma Listesi` : track.title} Sıraya Eklendi!`,
        description: (track.playlist
          ? track.playlist.tracks.length > 10
            ? track.playlist.tracks.slice(0, 10).map(track => `**•** ${track.title}`).join('\n') + `\n**•** ve **${track.playlist.tracks.length - 10}** şarkı daha...`
            : track.playlist.tracks.map(track => `**•** ${track.title}`).join('\n')
          : `**•** [${track.title}](${track.url})`)
          + `\n**•** Kaynak: \`${(!bridgeSource || mainSource == bridgeSource) ? (!mainSource.includes("YouTube") ? `${mainSource} (YouTube geçici olarak devre dışıdır)` : mainSource) : `${mainSource} => ${bridgeSource}`}\``,
        thumbnail: {
          url: track.playlist ? track.playlist.thumbnail : track.thumbnail,
        },
      };

      if (interaction.type === 2)
        await interaction.editReply({ embeds: [embed] });
      else await interaction.reply({ embeds: [embed] }).catch(() => { });

    } catch (error) {

      return require('../../events/discord-player/functions/errorHandler.js')(client, error, interaction.channel, interaction);

    }

  },
};