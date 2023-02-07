const { author } = require("canvacord");
const Discord = require("discord.js");
const humanize = require("humanize-duration");
const db = require("quick.db");

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
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    try {

      let shardInfo = {
        ping: await client.shard.fetchClientValues("ws.ping"),
        server_count: await client.shard.fetchClientValues("guilds.cache.size"),
        user_count: await client.shard.fetchClientValues("users.cache.size"),
        uptime: await client.shard.fetchClientValues("uptime"),
      };

      let shardDatas = [];

      for (let i = 0; i < client.shard.count; i++) {
        shardDatas.push({
          shardId: i,
          serverCount: shardInfo.server_count[i],
          userCount: shardInfo.user_count[i],
          ping: shardInfo.ping[i],
          uptime: shardInfo.uptime[i]
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
              `**• Kullanıcılar:** ${shardData.userCount}\n` +
              `**• Ping:** ${shardData.ping}ms\n` +
              `**• Uptime:** ${humanize(shardData.uptime, { language: "tr", round: true, largest: 2 })}`,
            inline: true,
          })),
          footer: {
            text: `Bu sunucu şu anda ${interaction.guild.shard.id + 1}. Shard'da bulunuyor.`,
            icon_url: interaction.guild.iconURL(),
          },
        }]
      });

    } catch (err) {

      console.log(err);

      await interaction.reply({ content: "Elimde olmayan sebeplerden dolayı verileri alamadım :/" });

    }

  }
};