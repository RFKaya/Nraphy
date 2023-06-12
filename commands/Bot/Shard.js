const humanize = require("humanize-duration");

module.exports = {
  interaction: {
    name: "shard",
    description: "Shard bilgilerini gösterir.",
    options: []
  },
  aliases: ["uptime", "ping", "shards"],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: 10000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    try {

      let shardInfo = {
        ping: await client.shard.fetchClientValues("ws.ping"),
        server_count: await client.shard.fetchClientValues("guilds.cache.size"),
        // user_count: await client.shard.fetchClientValues("users.cache.size"),
        uptime: await client.shard.fetchClientValues("uptime"),
        memoryUsageRss: await client.shard.broadcastEval(function () { return process.memoryUsage().rss; }),
        voiceAdaptersSize: await client.shard.fetchClientValues("voice.adapters.size")
      };

      let shardDatas = [];

      for (let i = 0; i < client.shard.count; i++) {
        shardDatas.push({
          shardId: i,
          serverCount: shardInfo.server_count[i],
          //userCount: shardInfo.user_count[i],
          ping: shardInfo.ping[i],
          uptime: shardInfo.uptime[i],
          memoryUsageRss: shardInfo.memoryUsageRss[i],
          voiceAdaptersSize: shardInfo.voiceAdaptersSize[i],
        });
      }

      interaction.reply({
        embeds: [{
          color: client.settings.embedColors.default,
          author: {
            name: `${client.user.username} • Shard Bilgileri`,
            icon_url: client.settings.icon,
          },
          fields: shardDatas.map(shardData => ({
            name: `**»** Shard ${shardData.shardId + 1}`,
            value:
              `**• Sunucular:** ${shardData.serverCount}\n` +
              //`**• Kullanıcılar:** ${shardData.userCount}\n` +
              `**• Ping:** ${shardData.ping}ms\n` +
              `**• Uptime:** ${humanize(shardData.uptime, { language: "tr", round: true, largest: 2 })}\n` +
              `**• Memory Usage:** ${(shardData.memoryUsageRss / (1024 ** 2)).toFixed()} MB\n` +
              `**• VoiceAdapters:** ${shardData.voiceAdaptersSize}`,
            inline: true,
          })),
          footer: {
            text: `Bu sunucu şu anda ${interaction.guild.shard.id + 1}. Shard'da bulunuyor.`,
            icon_url: interaction.guild.iconURL(),
          },
        }]
      });

    } catch (err) {

      client.logger.error(err);

      await interaction.reply({ content: "Elimde olmayan sebeplerden dolayı verileri alamadım :/" });

    }

  }
};