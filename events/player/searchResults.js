module.exports = (client, queue, query, tracks) => {
  queue.metadata.channel.send({
    embeds: [{
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Arama Sonuçları`,
        icon_url: client.settings.icon
      },
      title: `**»** "${query}" için arama sonuçları;`,
      description: `${tracks.map((t, i) => `**${i + 1}** - ${t.title}`).join('\n')}`,
      footer: {
        text: 'Arama işlemini bitirmek için "iptal" yazabilirsin.',
        icon_url: message.author.displayAvatarURL(),
      },
    }]
  });
};